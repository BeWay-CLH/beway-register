import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Tablas de catálogo (lookup) — ver CLAUDE.md > Modelo de datos.
// Lectura pública, escritura solo service role (RLS). Se leen en Server
// Components y se cachean por request con React `cache()`.
export type CatalogTable =
  | "countries"
  | "universities"
  | "study_fields"
  | "academic_status"
  | "languages_catalog"
  | "proficiency_levels"
  | "referral_sources"
  | "opportunity_types"
  | "work_modalities"
  | "sectors"
  | "availability_options"
  | "experience_types"
  | "project_types"
  | "certification_types";

export const getCatalog = cache(async (table: CatalogTable) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    throw new Error(`No se pudo cargar el catálogo "${table}": ${error.message}`);
  }

  return data;
});
