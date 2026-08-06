import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sin un dominio verificado en Resend, la API solo entrega correos a la
// propia cuenta de Resend — cualquier envío a un usuario real fallará
// hasta que RESEND_FROM_EMAIL apunte a un dominio verificado (ver .env.example).
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "BeWay <onboarding@resend.dev>";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function preRegistrationEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0B132B;">
      <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #64748B; margin: 0 0 8px;">BeWay</p>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Hola, ${firstName}</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Ya estás dentro del ecosistema BeWay. Cuando lancemos, tu CV Vivo estará listo para las
        empresas que buscan talento como el tuyo.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Puedes completar tu perfil ahora mismo, a tu ritmo — se guarda automáticamente en cada etapa.
      </p>
      <a
        href="${SITE_URL}/cv-vivo"
        style="display: inline-block; background: #00D4FF; color: #0B132B; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;"
      >
        Completar mi CV Vivo
      </a>
    </div>
  `;
}

// Correo transaccional propio de BeWay (distinto del enlace de confirmación
// de Supabase Auth) — reconoce el pre-registro y explica el siguiente paso.
// Nunca debe romper el flujo de registro: si Resend falla (ej. sandbox sin
// dominio verificado, ver arriba), se registra el error y se continúa.
export async function sendPreRegistrationEmail(to: string, fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Ya estás dentro del ecosistema BeWay",
      html: preRegistrationEmailHtml(firstName),
    });

    if (error) {
      console.error("[resend] no se pudo enviar el correo de pre-registro:", error);
    }
  } catch (err) {
    console.error("[resend] error inesperado enviando el correo de pre-registro:", err);
  }
}
