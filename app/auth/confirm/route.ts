import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Procesa el enlace de confirmación de Supabase Auth (registro, y en el
// futuro cambio de email / reset de password). El template de correo debe
// usar `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
// en vez de `{{ .ConfirmationURL }}` por defecto — Authentication > Email
// Templates en el dashboard de Supabase. `{{ .SiteURL }}` sale de
// Authentication > URL Configuration > Site URL: debe apuntar al dominio
// real (Vercel), no a localhost.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/cv-vivo";

  // Redirect limpio: el token nunca queda expuesto en la URL de destino.
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/registro";
  redirectTo.searchParams.set("error", "confirmation_failed");
  return NextResponse.redirect(redirectTo);
}
