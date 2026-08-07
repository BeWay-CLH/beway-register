"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { educationEntrySchema, type EducationEntryInput } from "@/lib/validations/cv-vivo/educacion";

// Server Actions de la etapa 4. RLS (education_*_own) ya garantiza que
// cada usuario solo lee/escribe sus propias filas, pero además filtramos
// por profile_id explícitamente para no depender solo de eso.
export async function saveEducationEntry(input: EducationEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = educationEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { id, universityId, studyFieldId, academicStatusId, startDate, isCurrent, description } = parsed.data;
  const endDate = isCurrent ? null : parsed.data.endDate;

  if (id) {
    const { error } = await supabase
      .from("education")
      .update({
        university_id: universityId,
        study_field_id: studyFieldId,
        academic_status_id: academicStatusId,
        start_date: startDate,
        end_date: endDate,
        is_current: isCurrent,
        description,
      })
      .eq("id", id)
      .eq("profile_id", userId);

    if (error) {
      return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
    }
    return { status: "success" };
  }

  // La primera entrada de un perfil queda marcada is_primary — hay un
  // índice único parcial que garantiza que nunca haya dos (ver migración
  // de profile_entries).
  const { count } = await supabase
    .from("education")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", userId);

  const { error } = await supabase.from("education").insert({
    profile_id: userId,
    university_id: universityId,
    study_field_id: studyFieldId,
    academic_status_id: academicStatusId,
    start_date: startDate,
    end_date: endDate,
    is_current: isCurrent,
    description,
    is_primary: (count ?? 0) === 0,
  });

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteEducationEntry(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("education").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
