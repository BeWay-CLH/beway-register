"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { preferencesSchema, type PreferencesInput } from "@/lib/validations/cv-vivo/preferencias";

// Server Action de la etapa 9. `preferences` va primero: las tres tablas
// puente referencian preferences.profile_id (no profiles.id), así que sin
// esa fila no se puede insertar en ninguna. Cada guardado reemplaza por
// completo la selección de cada categoría (borra todo lo previo, inserta
// lo nuevo) en vez de calcular un diff — más simple y suficiente para un
// formulario de selección múltiple sin límite de cantidad.
export async function savePreferences(input: PreferencesInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { availabilityOptionId, opportunityTypeIds, workModalityIds, sectorIds } = parsed.data;

  const { error: prefError } = await supabase
    .from("preferences")
    .upsert({ profile_id: userId, availability_option_id: availabilityOptionId });

  if (prefError) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  const [{ error: deleteOpportunityError }, { error: deleteModalityError }, { error: deleteSectorError }] =
    await Promise.all([
      supabase.from("preference_opportunity_types").delete().eq("profile_id", userId),
      supabase.from("preference_work_modalities").delete().eq("profile_id", userId),
      supabase.from("preference_sectors").delete().eq("profile_id", userId),
    ]);

  if (deleteOpportunityError || deleteModalityError || deleteSectorError) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  const insertPromises = [];
  if (opportunityTypeIds.length > 0) {
    insertPromises.push(
      supabase
        .from("preference_opportunity_types")
        .insert(opportunityTypeIds.map((id) => ({ profile_id: userId, opportunity_type_id: id }))),
    );
  }
  if (workModalityIds.length > 0) {
    insertPromises.push(
      supabase
        .from("preference_work_modalities")
        .insert(workModalityIds.map((id) => ({ profile_id: userId, work_modality_id: id }))),
    );
  }
  if (sectorIds.length > 0) {
    insertPromises.push(
      supabase.from("preference_sectors").insert(sectorIds.map((id) => ({ profile_id: userId, sector_id: id }))),
    );
  }

  const results = await Promise.all(insertPromises);
  if (results.some((result) => result.error)) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }

  return { status: "success" };
}
