import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Cliente sin sesión, para datos de lectura pública (catálogos). No usa
// cookies() — a propósito, porque lib/catalogs.ts lo envuelve en
// unstable_cache(), y Next.js no permite leer cookies() dentro de una
// función cacheada entre requests. Los catálogos son públicos vía RLS
// (policy "..._public_read"), así que no necesitan la sesión del usuario.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
