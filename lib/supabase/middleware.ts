import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresca la sesión de Supabase Auth en cada request. Se invoca desde
// proxy.ts (raíz). Ver:
// https://supabase.com/docs/guides/auth/server-side/nextjs
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Antes de conectar un proyecto Supabase (o antes de correr `supabase
  // start` en local) estas variables no existen todavía. Sin este guard,
  // cada request de cada ruta tira un 500 en vez de dejar avanzar el
  // desarrollo de páginas que aún no tocan auth.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "[proxy] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY no están definidas — se omite el refresco de sesión. Configura .env.local (ver README.md).",
    );
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // No ejecutar lógica entre createServerClient() y getUser(): cualquier
  // código en medio puede causar problemas difíciles de depurar con la
  // expiración de sesiones.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
