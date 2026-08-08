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

// Genérica sobre el nombre de tabla (en vez de un solo `unstable_cache` con
// `table: CatalogTable`) para que el tipo de retorno se angoste a las
// columnas reales de esa tabla — con `table` como unión, TS infería una
// unión de las columnas de TODOS los catálogos.
export async function getCatalog<T extends CatalogTable>(table: T) {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        throw new Error(`No se pudo cargar el catálogo "${table}": ${error.message}`);
      }

      return data;
    },
    ["catalog", table],
    { revalidate: 300 },
  )();
}
