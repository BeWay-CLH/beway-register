import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/cv-vivo/stages";

// Perfil del usuario autenticado, cacheado por request con React `cache()`
// — el layout del wizard y cada página de etapa lo llaman por separado,
// pero comparten la misma consulta dentro de un mismo render del servidor.
// null si no hay sesión o no existe la fila de profiles (el layout redirige
// en ese caso, ver app/cv-vivo/layout.tsx).
export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return profile;
});
