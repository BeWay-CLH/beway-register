import { createAdminClient } from "@/lib/supabase/admin";
import { sendPlatformUpdateEmail } from "@/lib/email/send";
import { wasEmailSent, markEmailSent } from "@/lib/email/log";
import { createUnsubscribeUrl } from "@/lib/email/unsubscribe";
import type { TwoUpItem } from "@/emails/components";

export type BroadcastContent = {
  subject: string;
  eyebrow?: string;
  title: string;
  bodyParagraphs: string[];
  image?: { src: string; width?: number; height: number; alt: string; caption?: string };
  stats?: [TwoUpItem, TwoUpItem];
  ctaUrl: string;
  ctaLabel: string;
  /** Identifica ESTE envío puntual, no el tipo de correo — cada hito real
   * de #7 necesita su propio dedupeKey (ej. "2026-08-universidades-piloto")
   * para que un reintento del mismo broadcast no duplique, pero el
   * próximo hito sí pueda enviarse. */
  dedupeKey: string;
};

const SOFT_REMINDER_TEXT = "Todavía no completaste tu CV Vivo — son etapas cortas, puedes hacerlo por partes.";

// Correo #7 — Actualización de avance de la plataforma (docs/email-strategy.md).
// Envío manual (ver app/api/admin/send-broadcast/route.ts), nunca
// programado: cada llamada corresponde a un hito real. Filtra por
// marketing_consent, e incluye el recordatorio suave solo para quien no
// completó su CV Vivo — nunca como cuerpo principal del correo.
export async function sendPlatformUpdateBroadcast(content: BroadcastContent) {
  const admin = createAdminClient();
  const counts = { sent: 0, skippedAlreadySent: 0, errors: 0 };

  const { data: recipients, error } = await admin
    .from("profiles")
    .select("id, email, cv_completed_at, unsubscribe_token")
    .eq("marketing_consent", true);

  if (error || !recipients) {
    console.error("[broadcast] error consultando destinatarios:", error);
    throw new Error("No se pudo consultar la lista de destinatarios.");
  }

  for (const recipient of recipients) {
    try {
      if (await wasEmailSent(recipient.id, "platform_update", content.dedupeKey)) {
        counts.skippedAlreadySent += 1;
        continue;
      }

      await sendPlatformUpdateEmail({
        to: recipient.email,
        subject: content.subject,
        eyebrow: content.eyebrow,
        title: content.title,
        bodyParagraphs: content.bodyParagraphs,
        image: content.image,
        stats: content.stats,
        reminderText: recipient.cv_completed_at ? undefined : SOFT_REMINDER_TEXT,
        ctaUrl: content.ctaUrl,
        ctaLabel: content.ctaLabel,
        unsubscribeUrl: createUnsubscribeUrl(recipient.unsubscribe_token),
      });
      await markEmailSent(recipient.id, "platform_update", content.dedupeKey);
      counts.sent += 1;
    } catch (err) {
      console.error(`[broadcast] error enviando a perfil ${recipient.id}:`, err);
      counts.errors += 1;
    }
  }

  return { recipients: recipients.length, ...counts };
}
