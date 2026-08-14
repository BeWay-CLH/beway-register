import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWizardProgress } from "@/lib/cv-vivo/progress";
import { WIZARD_STAGES, getStagePosition } from "@/lib/cv-vivo/stages";
import { REMINDER_THRESHOLDS } from "@/lib/email/config";
import { wasEmailSent, markEmailSent } from "@/lib/email/log";
import { sendNoStartReminderEmail, sendHalfwayReminderEmail, sendHalfwayFinalReminderEmail } from "@/lib/email/send";
import { createUnsubscribeUrl } from "@/lib/email/unsubscribe";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysSince(isoDate: string) {
  return (Date.now() - new Date(isoDate).getTime()) / (24 * 60 * 60 * 1000);
}

// Job programado (Vercel Cron, ver vercel.json) para los correos #3/#4/#5
// — docs/email-strategy.md > "Basados en inactividad": no hay un evento
// que los dispare, así que esto corre a diario, revisa quién cruzó cada
// umbral, y usa email_log para no reenviar el mismo aviso dos veces.
// Ambos correos son "Comunicación" (docs/email-strategy.md > Las dos
// categorías): solo van a quien tiene marketing_consent activo.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const counts = { noStart: 0, halfwayFirst: 0, halfwaySecond: 0, errors: 0 };

  // Prefiltro amplio: el umbral más corto de los tres (noStartDays) ya
  // cubre a cualquier candidato de los otros dos, que son umbrales más
  // largos. cv_completed_at not null = ya no necesita ningún recordatorio
  // de progreso (ver correo #6).
  const { data: candidates, error } = await admin
    .from("profiles")
    .select("*")
    .eq("marketing_consent", true)
    .is("cv_completed_at", null)
    .lte("created_at", daysAgoIso(REMINDER_THRESHOLDS.noStartDays));

  if (error || !candidates) {
    console.error("[cron/email-reminders] error consultando candidatos:", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  for (const profile of candidates) {
    try {
      const { data: progressRow } = await admin.rpc("get_wizard_progress", { p_profile_id: profile.id }).single();
      if (!progressRow) continue;

      const progress = getWizardProgress({
        profile,
        hasEducation: progressRow.has_education,
        hasExperience: progressRow.has_experience,
        hasProjects: progressRow.has_projects,
        hasSkills: progressRow.has_skills,
        hasLanguages: progressRow.has_languages,
        hasCertifications: progressRow.has_certifications,
        hasPreferences: progressRow.has_preferences,
        hasEvidences: progressRow.has_evidences,
        hasPrivacySettings: progressRow.has_privacy_settings,
      });

      // #3 — sin ninguna etapa iniciada.
      if (progress.percent === 0) {
        if (daysSince(profile.created_at) < REMINDER_THRESHOLDS.noStartDays) continue;
        if (await wasEmailSent(profile.id, "no_start_reminder")) continue;

        await sendNoStartReminderEmail(profile.email, profile.full_name, createUnsubscribeUrl(profile.unsubscribe_token));
        await markEmailSent(profile.id, "no_start_reminder");
        counts.noStart += 1;
        continue;
      }

      // 100% ya se filtró por cv_completed_at, pero un cálculo en curso
      // (edge case de reordenar etapas) no debería mandar recordatorios.
      if (progress.percent === 100) continue;

      const { data: lastActivity } = await admin.rpc("get_profile_last_activity", { p_profile_id: profile.id });
      if (!lastActivity) continue;
      const inactivityDays = daysSince(lastActivity);

      const stage = WIZARD_STAGES.find((s) => s.slug === progress.nextIncompleteSlug);
      const stageName = stage?.label ?? progress.nextIncompleteSlug;
      const { position, total } = getStagePosition(progress.nextIncompleteSlug);
      const ctaUrl = `${SITE_URL}/cv-vivo/${progress.nextIncompleteSlug}`;
      const unsubscribeUrl = createUnsubscribeUrl(profile.unsubscribe_token);

      const sentFirst = await wasEmailSent(profile.id, "halfway_reminder_1");

      // #5 — 2do y último aviso: solo si ya se envió el 1er aviso y, pese
      // a eso, no hubo actividad nueva (inactivityDays sigue midiendo
      // desde el último toque real, así que "sin respuesta" es automático).
      if (sentFirst && inactivityDays >= REMINDER_THRESHOLDS.halfwaySecondDays) {
        if (await wasEmailSent(profile.id, "halfway_reminder_2")) continue;

        await sendHalfwayFinalReminderEmail({
          to: profile.email,
          fullName: profile.full_name,
          percent: progress.percent,
          stageName,
          stagePosition: position,
          stageTotal: total,
          ctaUrl,
          unsubscribeUrl,
        });
        await markEmailSent(profile.id, "halfway_reminder_2");
        counts.halfwaySecond += 1;
        continue;
      }

      // #4 — 1er aviso.
      if (!sentFirst && inactivityDays >= REMINDER_THRESHOLDS.halfwayFirstDays) {
        await sendHalfwayReminderEmail({
          to: profile.email,
          fullName: profile.full_name,
          percent: progress.percent,
          stageName,
          stagePosition: position,
          stageTotal: total,
          ctaUrl,
          unsubscribeUrl,
        });
        await markEmailSent(profile.id, "halfway_reminder_1");
        counts.halfwayFirst += 1;
      }
    } catch (err) {
      console.error(`[cron/email-reminders] error procesando perfil ${profile.id}:`, err);
      counts.errors += 1;
    }
  }

  return NextResponse.json({ ok: true, candidates: candidates.length, ...counts });
}
