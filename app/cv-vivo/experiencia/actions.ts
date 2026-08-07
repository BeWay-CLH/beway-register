"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { experienceEntrySchema, type ExperienceEntryInput } from "@/lib/validations/cv-vivo/experiencia";

const MAX_EXPERIENCES = 3;

// Server Actions de la etapa 5. El formulario ya oculta "agregar" al llegar
// a 3 entradas, pero el trigger de Postgres (enforce_max_entries_per_profile)
// es la fuente de verdad — si de todos modos llega un cuarto insert (dos
// pestañas abiertas, etc.), lo traducimos a un mensaje claro en vez de un
// error genérico de base de datos.
export async function saveExperienceEntry(input: ExperienceEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = experienceEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { id, companyName, roleTitle, experienceTypeId, sectorId, startDate, isCurrent, description } = parsed.data;
  const endDate = isCurrent ? null : parsed.data.endDate;

  if (id) {
    const { error } = await supabase
      .from("experiences")
      .update({
        company_name: companyName,
        role_title: roleTitle,
        experience_type_id: experienceTypeId,
        sector_id: sectorId,
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

  const { error } = await supabase.from("experiences").insert({
    profile_id: userId,
    company_name: companyName,
    role_title: roleTitle,
    experience_type_id: experienceTypeId,
    sector_id: sectorId,
    start_date: startDate,
    end_date: endDate,
    is_current: isCurrent,
    description,
  });

  if (error) {
    if (error.code === "23514") {
      return { status: "error", message: `Ya alcanzaste el máximo de ${MAX_EXPERIENCES} experiencias.` };
    }
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteExperienceEntry(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("experiences").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
