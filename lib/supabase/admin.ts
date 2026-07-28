import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Cliente con service role — bypassea RLS. SOLO para Server Actions que lo
// necesiten explícitamente (ej. crear la fila de `profiles` justo después de
// auth.signUp(), antes de que exista sesión si el proyecto requiere
// confirmación de email). Nunca importar desde un componente/archivo con
// "use client", y nunca reexportar la service role key al cliente.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
