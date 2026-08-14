const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Enlace de baja de un solo clic (correos de comunicación, #3/#4/#5/#7):
// el destinatario no tiene sesión iniciada al abrir el correo. En vez de
// poner profiles.id (dato personal identificable) en la URL —CLAUDE.md >
// Seguridad: "No poner datos personales en query params ni en URLs"—, se
// usa profiles.unsubscribe_token: un UUID aleatorio (gen_random_uuid(),
// ver la migración) sin relación derivable con el id real, igual criterio
// que el token_hash de Supabase Auth en /auth/confirm.
export function createUnsubscribeUrl(unsubscribeToken: string): string {
  return `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;
}
