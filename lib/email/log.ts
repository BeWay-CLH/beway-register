import { createAdminClient } from "@/lib/supabase/admin";
import type { EmailType } from "./types";

// Idempotencia de correos sin un evento único que garantice "una sola vez"
// (docs/email-strategy.md > Mecanismos de envío): #3/#4/#5 (cron de
// inactividad) y #7 (broadcast, un dedupeKey por envío — ej. su fecha o
// slug). Los correos de evento (#2, #6, #8) no pasan por acá: su propio
// disparador ya es la garantía (verificación de una sola vez, o
// profiles.cv_completed_at para #6 específicamente).
export async function wasEmailSent(profileId: string, emailType: EmailType, dedupeKey = ""): Promise<boolean> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("email_log")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .eq("email_type", emailType)
    .eq("dedupe_key", dedupeKey);

  if (error) {
    console.error(`[email/log] no se pudo consultar email_log (${emailType}/${profileId}):`, error);
    // Ante la duda, tratar como "ya enviado" — preferible perderse un
    // recordatorio a duplicar un correo por un fallo de lectura transitorio.
    return true;
  }

  return (count ?? 0) > 0;
}

export async function markEmailSent(profileId: string, emailType: EmailType, dedupeKey = ""): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("email_log").insert({ profile_id: profileId, email_type: emailType, dedupe_key: dedupeKey });

  if (error) {
    console.error(`[email/log] no se pudo registrar el envío de ${emailType} para ${profileId}:`, error);
  }
}
