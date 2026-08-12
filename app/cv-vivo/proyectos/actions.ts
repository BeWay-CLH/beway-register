"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
import { projectEntrySchema, type ProjectEntryInput } from "@/lib/validations/cv-vivo/proyectos";

export async function saveProjectEntry(input: ProjectEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = projectEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { id, name, projectTypeId, url, startDate, endDate, description } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("projects")
      .update({
        name,
        project_type_id: projectTypeId,
        url,
        start_date: startDate,
        end_date: endDate,
        description,
      })
      .eq("id", id)
      .eq("profile_id", userId);

    if (error) {
      return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
    }
    return { status: "success" };
  }

  const { error } = await supabase.from("projects").insert({
    profile_id: userId,
    name,
    project_type_id: projectTypeId,
    url,
    start_date: startDate,
    end_date: endDate,
    description,
  });

  if (error) {
    if (error.code === "23514") {
      return { status: "error", message: `Ya alcanzaste el máximo de ${MAX_REPEATABLE_ENTRIES} proyectos.` };
    }
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteProjectEntry(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("projects").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
