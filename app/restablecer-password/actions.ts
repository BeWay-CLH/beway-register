"use server";

import { requireUser } from "@/lib/cv-vivo/require-user";
import { restablecerPasswordSchema, type RestablecerPasswordInput } from "@/lib/validations/restablecer-password";

export type RestablecerPasswordResult = { status: "success" } | { status: "error"; message: string };

// Completa el flujo de recuperación (correo #9): requiere la sesión
// temporal que /auth/confirm ya estableció al verificar el token de
// recovery. Reutiliza requireUser() por el mismo motivo que el resto del
// wizard — rate limit por IP y por usuario (CLAUDE.md > Seguridad).
export async function updatePassword(input: RestablecerPasswordInput): Promise<RestablecerPasswordResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };

  const parsed = restablecerPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "La contraseña debe tener al menos 8 caracteres." };
  }

  const { error } = await auth.supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: "error", message: "No se pudo actualizar tu contraseña. Intenta de nuevo." };
  }

  return { status: "success" };
}
