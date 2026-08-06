"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit, userRateLimit } from "@/lib/rate-limit";
import { presentacionSchema, type PresentacionInput } from "@/lib/validations/cv-vivo/presentacion";

export type SaveStageResult = { status: "success" } | { status: "error"; message: string };

export async function savePresentacion(input: PresentacionInput): Promise<SaveStageResult> {
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

  const parsed = presentacionSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      headline: parsed.data.headline,
      bio: parsed.data.bio,
    })
    .eq("id", user.id);

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  return { status: "success" };
}
