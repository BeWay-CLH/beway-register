// Correos enviados vía Resend (docs/email-strategy.md > Mapa de correos).
// #1 (verificación) y #9 (recuperación) NO están acá — salen del flujo de
// Supabase Auth con plantillas propias (ver supabase/templates/), no de
// este cliente de Resend, así que no participan de email_log tampoco.
export type EmailType =
  | "welcome"
  | "no_start_reminder"
  | "halfway_reminder_1"
  | "halfway_reminder_2"
  | "cv_completed"
  | "platform_update"
  | "data_export"
  | "data_deletion";
