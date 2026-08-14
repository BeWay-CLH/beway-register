"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit } from "@/lib/rate-limit";
import { recuperarPasswordSchema, type RecuperarPasswordInput } from "@/lib/validations/recuperar-password";

export type RecuperarPasswordResult = { status: "success" } | { status: "error"; message: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Solicitud de recuperación de contraseña (correo #9, docs/email-strategy.md).
// Sale del flujo de Supabase Auth (branding vía SMTP custom + plantilla
// propia — ver supabase/config.toml y supabase/templates/recovery.html).
// CLAUDE.md > Seguridad: rate limit por IP como en registro/login, y un
// mensaje de éxito genérico que no confirma ni niega si el correo existe
// (Supabase ya se comporta así internamente; replicarlo acá evita que un
// error explícito de "correo no encontrado" filtre esa información).
export async function requestPasswordReset(input: RecuperarPasswordInput): Promise<RecuperarPasswordResult> {
  const ip = await getRequestIp();
  const { success: withinRateLimit } = await ipRateLimit.limit(ip);
  if (!withinRateLimit) {
    return { status: "error", message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo." };
  }

  const parsed = recuperarPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Ingresa un correo válido." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${SITE_URL}/restablecer-password`,
  });

  // Sin `if (error)`: Supabase no distingue "correo no existe" en la
  // respuesta pública precisamente para no filtrar qué cuentas existen —
  // este Server Action hace lo mismo, siempre "success".
  return { status: "success" };
}
