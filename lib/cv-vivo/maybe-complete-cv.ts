import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getWizardProgress } from "@/lib/cv-vivo/progress";
import { sendCvCompleteEmail } from "@/lib/email/send";

// Correo #6 — 100% completado (docs/email-strategy.md). Se llama al
// final de cualquier Server Action de guardado del wizard que pudiera
// completar la última etapa faltante (no hace falta en las de borrado:
// eliminar una entrada nunca sube el % de completitud). Idempotente vía
// profiles.cv_completed_at: la actualización solo aplica si sigue en
// null, así que dos guardados casi simultáneos no duplican el correo.
export async function maybeSendCvCompleteEmail(supabase: SupabaseClient<Database>, userId: string) {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!profile || profile.cv_completed_at) return;

  const { data: progress } = await supabase.rpc("get_wizard_progress", { p_profile_id: userId }).single();
  if (!progress) return;

  const wizardProgress = getWizardProgress({
    profile,
    hasEducation: progress.has_education,
    hasExperience: progress.has_experience,
    hasProjects: progress.has_projects,
    hasSkills: progress.has_skills,
    hasLanguages: progress.has_languages,
    hasCertifications: progress.has_certifications,
    hasPreferences: progress.has_preferences,
    hasEvidences: progress.has_evidences,
    hasPrivacySettings: progress.has_privacy_settings,
  });

  if (wizardProgress.percent !== 100) return;

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ cv_completed_at: new Date().toISOString() })
    .eq("id", userId)
    .is("cv_completed_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[maybeSendCvCompleteEmail] no se pudo marcar cv_completed_at:", error);
    return;
  }
  // null = otro guardado concurrente ya lo marcó primero; no reenviar.
  if (!updated) return;

  after(() => sendCvCompleteEmail(profile.email, profile.full_name));
}
