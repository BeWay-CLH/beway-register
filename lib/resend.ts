import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sin un dominio verificado en Resend, la API solo entrega correos a la
// propia cuenta de Resend — cualquier envío a un usuario real fallará
// hasta que RESEND_FROM_EMAIL apunte a un dominio verificado (ver .env.example).
export const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "BeWay <onboarding@resend.dev>";
