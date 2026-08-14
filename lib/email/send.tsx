import { resend, FROM_ADDRESS } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { NoStartReminderEmail } from "@/emails/NoStartReminderEmail";
import { HalfwayReminderEmail } from "@/emails/HalfwayReminderEmail";
import { HalfwayFinalReminderEmail } from "@/emails/HalfwayFinalReminderEmail";
import { CvCompleteEmail } from "@/emails/CvCompleteEmail";
import { PlatformUpdateEmail } from "@/emails/PlatformUpdateEmail";
import { DataRequestConfirmationEmail } from "@/emails/DataRequestConfirmationEmail";
import type { TwoUpItem } from "@/emails/components";

function firstNameOf(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

async function send(to: string, subject: string, react: React.ReactElement, logLabel: string) {
  try {
    const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, react });
    if (error) {
      console.error(`[email] no se pudo enviar ${logLabel}:`, error);
    }
  } catch (err) {
    console.error(`[email] error inesperado enviando ${logLabel}:`, err);
  }
}

// Correo #2 — Bienvenida (docs/email-strategy.md). Disparado desde
// app/auth/confirm/route.ts justo tras verificar el correo del Paso 1.
// Nunca debe romper ese flujo: los errores se registran y se tragan.
export async function sendWelcomeEmail(to: string, fullName: string) {
  const firstName = firstNameOf(fullName);
  await send(to, `¡Bienvenido a BeWay, ${firstName}! 🎉`, <WelcomeEmail firstName={firstName} />, "el correo de bienvenida");
}

// Correo #3 — No ha iniciado el CV Vivo. Job programado (ver
// app/api/cron/email-reminders/route.ts), idempotente vía email_log.
export async function sendNoStartReminderEmail(to: string, fullName: string, unsubscribeUrl: string) {
  const firstName = firstNameOf(fullName);
  await send(
    to,
    "Tu perfil profesional te está esperando",
    <NoStartReminderEmail firstName={firstName} unsubscribeUrl={unsubscribeUrl} />,
    "el recordatorio de CV Vivo sin iniciar",
  );
}

type HalfwayParams = {
  to: string;
  fullName: string;
  percent: number;
  stageName: string;
  stagePosition: number;
  stageTotal: number;
  ctaUrl: string;
  unsubscribeUrl: string;
};

// Correo #4 — CV Vivo a medias, 1er aviso. Job programado, idempotente.
export async function sendHalfwayReminderEmail({ to, fullName, percent, stageName, stagePosition, stageTotal, ctaUrl, unsubscribeUrl }: HalfwayParams) {
  const firstName = firstNameOf(fullName);
  await send(
    to,
    `Vas a la mitad de tu CV Vivo, ${firstName}`,
    <HalfwayReminderEmail
      firstName={firstName}
      percent={percent}
      stageName={stageName}
      stagePosition={stagePosition}
      stageTotal={stageTotal}
      ctaUrl={ctaUrl}
      unsubscribeUrl={unsubscribeUrl}
    />,
    "el 1er recordatorio de CV Vivo a medias",
  );
}

// Correo #5 — CV Vivo a medias, 2do y último aviso. Job programado,
// idempotente; tras este, el perfil pasa a la cadencia general de #7.
export async function sendHalfwayFinalReminderEmail({ to, fullName, percent, stageName, stagePosition, stageTotal, ctaUrl, unsubscribeUrl }: HalfwayParams) {
  const firstName = firstNameOf(fullName);
  await send(
    to,
    "Última oportunidad para tu insignia de fundador",
    <HalfwayFinalReminderEmail
      firstName={firstName}
      percent={percent}
      stageName={stageName}
      stagePosition={stagePosition}
      stageTotal={stageTotal}
      ctaUrl={ctaUrl}
      unsubscribeUrl={unsubscribeUrl}
    />,
    "el 2do recordatorio de CV Vivo a medias",
  );
}

// Correo #6 — 100% completado. Inmediato al completar la última etapa,
// idempotente vía profiles.cv_completed_at (ver lib/cv-vivo).
export async function sendCvCompleteEmail(to: string, fullName: string) {
  const firstName = firstNameOf(fullName);
  await send(to, "🏆 Tu CV Vivo está completo — ganaste tu insignia", <CvCompleteEmail firstName={firstName} />, "el correo de 100% completado");
}

type PlatformUpdateParams = {
  to: string;
  subject: string;
  eyebrow?: string;
  title: string;
  bodyParagraphs: string[];
  image?: { src: string; width?: number; height: number; alt: string; caption?: string };
  stats?: [TwoUpItem, TwoUpItem];
  reminderText?: string;
  ctaUrl: string;
  ctaLabel: string;
  unsubscribeUrl: string;
};

// Correo #7 — Actualización de avance de la plataforma. Broadcast manual
// (ver lib/email/broadcast.ts), nunca automático — cada llamada es un
// hito real, no una cadencia programada.
export async function sendPlatformUpdateEmail({ to, subject, ...props }: PlatformUpdateParams) {
  await send(to, subject, <PlatformUpdateEmail {...props} />, "la actualización de plataforma");
}

// Correo #8 — Confirmación de exportación/eliminación de datos (Art.
// 15/17 RGPD). Inmediato al usar esas funciones — ver app/cuenta/actions.ts.
export async function sendDataRequestConfirmationEmail(to: string, action: "export" | "deletion", requestedAt: string) {
  const subject =
    action === "export" ? "Tu solicitud de exportar tus datos fue procesada" : "Tu solicitud de eliminar tu cuenta fue procesada";
  await send(
    to,
    subject,
    <DataRequestConfirmationEmail action={action} requestedAt={requestedAt} />,
    `la confirmación de ${action === "export" ? "exportación" : "eliminación"} de datos`,
  );
}
