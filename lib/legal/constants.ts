// Versión vigente de cada documento legal (BEWAY | Pre-Registro · Cambios
// UX + legal, v3.0). Se guarda junto al consentimiento (profiles.terms_version
// / privacy_notice_version) para poder detectar cuándo un usuario aceptó una
// versión anterior y pedir re-aceptación si el texto cambia de forma
// material. Súbelas a mano cuando Legal apruebe una redacción nueva.
export const TERMS_VERSION = "1.0";
export const PRIVACY_NOTICE_VERSION = "1.0";
export const AVISO_LEGAL_VERSION = "1.0";
export const COOKIES_POLICY_VERSION = "1.0";

// team@clhglobal.org ya es el correo de contacto real usado en el resto de
// la app (app/(marketing)/page.tsx, mensajes de error de registro/cuenta) —
// no es un dato pendiente, así que no se deja como placeholder.
export const GENERAL_CONTACT_EMAIL = "team@clhglobal.org";
// Sin buzón de privacidad dedicado todavía (docs/pending-decisions.md #2):
// placeholder visible hasta que Negocio confirme uno.
export const PRIVACY_CONTACT_EMAIL = "[EMAIL PRIVACIDAD]";
