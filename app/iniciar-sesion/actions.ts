"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit } from "@/lib/rate-limit";
import { loginSchema, type LoginInput } from "@/lib/validations/login";

export type LoginResult = { status: "success" } | { status: "error"; message: string };

// Server Action de inicio de sesión (CLAUDE.md > Seguridad): rate limit por
// IP para frenar fuerza bruta, validación de servidor con el mismo schema
// que el cliente. El mensaje de error es genérico a propósito — no
// distingue "correo no existe" de "contraseña incorrecta", para no filtrar
// qué correos están registrados.
export async function loginAccount(input: LoginInput): Promise<LoginResult> {
  const ip = await getRequestIp();
  const { success: withinRateLimit } = await ipRateLimit.limit(ip);
  if (!withinRateLimit) {
    return {
      status: "error",
      message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
    };
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "Correo o contraseña incorrectos." };
  }

  return { status: "success" };
}
