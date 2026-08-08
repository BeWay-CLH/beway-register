"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { personalSchema, type PersonalInput } from "@/lib/validations/cv-vivo/personal";

// Server Action de la etapa 2. RLS ya garantiza que solo se actualiza la
// fila propia (profiles_update_own).
export async function savePersonal(input: PersonalInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = personalSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  // .select().single() fuerza el error si el update no matchea ninguna
  // fila (perfil inexistente) — un UPDATE sin filtro coincidente no es un
  // error para Postgres/PostgREST, así que sin esto "success" no
  // garantiza que algo se haya guardado.
  const { error } = await supabase
    .from("profiles")
    .update({
      phone: parsed.data.phone,
      academic_status_id: parsed.data.academicStatusId,
    })
    .eq("id", userId)
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  return { status: "success" };
}
