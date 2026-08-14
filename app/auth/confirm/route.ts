import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email/send";

// Procesa el enlace de confirmación de Supabase Auth (registro y
// recuperación de contraseña — ver emails/VerificationEmail.tsx y
// emails/PasswordRecoveryEmail.tsx). Las plantillas usan
// `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
// (confirmación) y `...&type=recovery&next=/restablecer-password`
// (recuperación) en vez de `{{ .ConfirmationURL }}` por defecto —
// Authentication > Email Templates en el dashboard de Supabase (o
// supabase/config.toml > [auth.email.template.*] para desarrollo local).
// `{{ .SiteURL }}` sale de Authentication > URL Configuration > Site URL:
// debe apuntar al dominio real (bbeway.com), no a localhost.
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
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      // Correo #2 (Bienvenida, docs/email-strategy.md): inmediato al
      // verificar el correo del Paso 1 — un token de signup solo se
      // verifica con éxito una vez, así que este disparador ya es
      // idempotente por construcción. `after()` (no un `void` suelto):
      // en un runtime serverless, una promesa sin await puede quedar
      // truncada en cuanto se envía la respuesta de redirect.
      if (type === "signup" && data.user) {
        const userId = data.user.id;
        after(async () => {
          const admin = createAdminClient();
          const { data: profile } = await admin.from("profiles").select("email, full_name").eq("id", userId).single();
          if (profile) {
            await sendWelcomeEmail(profile.email, profile.full_name);
          }
        });
      }
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/registro";
  redirectTo.searchParams.set("error", "confirmation_failed");
  return NextResponse.redirect(redirectTo);
}
