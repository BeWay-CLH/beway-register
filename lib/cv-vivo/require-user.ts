import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit, userRateLimit } from "@/lib/rate-limit";

// Resultado común de cualquier Server Action de guardado de etapa.
export type SaveStageResult = { status: "success" } | { status: "error"; message: string };

export type RequireUserResult =
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { ok: false; message: string };

// Guard compartido por los Server Actions de cada etapa del wizard: sesión
// válida + rate limit por IP y por usuario (CLAUDE.md > Seguridad: "en cada
// guardado de etapa").
export async function requireUser(): Promise<RequireUserResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const ip = await getRequestIp();
  const [{ success: ipOk }, { success: userOk }] = await Promise.all([
    ipRateLimit.limit(ip),
    userRateLimit.limit(user.id),
  ]);

  if (!ipOk || !userOk) {
    return { ok: false, message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo." };
  }

  return { ok: true, supabase, userId: user.id };
}
