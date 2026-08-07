"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { presentacionSchema, type PresentacionInput } from "@/lib/validations/cv-vivo/presentacion";

export async function savePresentacion(input: PresentacionInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

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
    .eq("id", userId);

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  return { status: "success" };
}
