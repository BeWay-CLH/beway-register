import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// Tablas de catálogo (lookup) — ver CLAUDE.md > Modelo de datos.
// Lectura pública, escritura solo service role (RLS). Casi nunca cambian
// ("añadir opción = insertar fila, no tocar código"), así que se cachean
// con la data cache de Next.js (persiste entre requests, no solo dentro
// de un mismo render) en vez de React `cache()` — eliminando la mayoría
// de las idas y vueltas repetidas a Supabase en cada navegación del wizard.
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

const getCachedCatalog = unstable_cache(
  async (table: CatalogTable) => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      throw new Error(`No se pudo cargar el catálogo "${table}": ${error.message}`);
    }

    return data;
  },
  ["catalog"],
  { revalidate: 300 },
);

export async function getCatalog(table: CatalogTable) {
  return getCachedCatalog(table);
}
