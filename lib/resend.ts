import { Resend } from "resend";

let resendClient: Resend | null = null;

// Instancia perezosa a propósito: `new Resend(...)` valida la API key en
// su propio constructor y lanza de inmediato si falta ("Missing API
// key..."). Si eso corriera a nivel de módulo (como antes, con
// `export const resend = new Resend(...)`), CUALQUIER import de este
// archivo —incluido el que hace `next build` al recolectar datos de cada
// página/ruta, que no necesita enviar ningún correo real— tumbaba el
// build entero en cualquier entorno sin RESEND_API_KEY configurado. Así
// falló el CI de GitHub Actions: ese pipeline no tiene el secreto, y
// `next build` igual intenta importar app/api/cron/email-reminders/route.ts
// (que importa lib/email/send.tsx, que importaba `resend` de acá) para
// analizarla estáticamente. Construir el cliente solo cuando de verdad se
// va a enviar un correo evita que el build dependa de tener la clave.
export function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Sin un dominio verificado en Resend, la API solo entrega correos a la
// propia cuenta de Resend — cualquier envío a un usuario real fallará
// hasta que RESEND_FROM_EMAIL apunte a un dominio verificado (ver .env.example).
export const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "BeWay <onboarding@resend.dev>";
