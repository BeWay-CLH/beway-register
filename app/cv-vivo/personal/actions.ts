"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit, userRateLimit } from "@/lib/rate-limit";
import { personalSchema, type PersonalInput } from "@/lib/validations/cv-vivo/personal";

export type SaveStageResult = { status: "success" } | { status: "error"; message: string };

// Server Action de la etapa 2. Rate limit por IP y por usuario (CLAUDE.md >
// Seguridad: "en cada guardado de etapa"), validación de servidor con el
// mismo schema del cliente, RLS ya garantiza que solo se actualiza la fila
// propia (profiles_update_own).
export async function savePersonal(input: PersonalInput): Promise<SaveStageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const ip = await getRequestIp();
  const [{ success: ipOk }, { success: userOk }] = await Promise.all([
    ipRateLimit.limit(ip),
    userRateLimit.limit(user.id),
  ]);
  if (!ipOk || !userOk) {
    return { status: "error", message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo." };
  }

  const parsed = personalSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      phone: parsed.data.phone,
      academic_status_id: parsed.data.academicStatusId,
    })
    .eq("id", user.id);

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  return { status: "success" };
}
