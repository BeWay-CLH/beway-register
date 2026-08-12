"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getRequestIp, ipRateLimit } from "@/lib/rate-limit";
import { sendPreRegistrationEmail } from "@/lib/resend";
import { registroSchema, type RegistroInput } from "@/lib/validations/registro";

export type RegisterAccountResult =
  | { status: "success" }
  | { status: "confirm_email"; email: string }
  | { status: "error"; message: string };

// Server Action del Paso 1 (CLAUDE.md > Seguridad): rate limit por IP,
// validación de servidor con el mismo schema zod que el cliente, y
// verificación de Turnstile antes de crear la cuenta. Nunca confiar en que
// el cliente ya validó.
export async function registerAccount(
  input: RegistroInput,
): Promise<RegisterAccountResult> {
  const ip = await getRequestIp();
  const { success: withinRateLimit } = await ipRateLimit.limit(ip);
  if (!withinRateLimit) {
    return {
      status: "error",
      message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
    };
  }

  const parsed = registroSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstileOk) {
    return {
      status: "error",
      message: "No pudimos verificar que eres una persona. Intenta de nuevo.",
    };
  }

  const supabase = await createClient();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError || !signUpData.user) {
    return {
      status: "error",
      message:
        signUpError?.code === "user_already_exists"
          ? "Ya existe una cuenta con ese correo. Inicia sesión en su lugar."
          : "No se pudo crear la cuenta. Intenta de nuevo.",
    };
  }

  // Cuando el correo ya pertenece a una cuenta confirmada, Supabase Auth
  // responde con un usuario "ofuscado" (identities: []) en vez de un error,
  // para no filtrar qué correos existen. Cortar aquí evita insertar un
  // `profiles` duplicado sobre el id de otra cuenta.
  if (signUpData.user.identities && signUpData.user.identities.length === 0) {
    return {
      status: "error",
      message: "Ya existe una cuenta con ese correo. Inicia sesión en su lugar.",
    };
  }

  const admin = createAdminClient();
  const termsAcceptedAt = new Date().toISOString();
  const insertProfile = () =>
    admin.from("profiles").insert({
      id: signUpData.user!.id,
      email: data.email,
      full_name: data.fullName,
      country_id: data.countryId,
      university_id: data.universityId,
      study_field_id: data.studyFieldId,
      referral_source_id: data.referralSourceId,
      terms_accepted_at: termsAcceptedAt,
      marketing_consent: data.marketingConsent,
    });

  let { error: profileError } = await insertProfile();
  if (profileError) {
    // Un reintento inmediato: contrato documentado en la migración de
    // `profiles` (no hay trigger sobre auth.users, así que esta segunda
    // escritura es la única forma de que el perfil exista).
    ({ error: profileError } = await insertProfile());

    // 23505 = unique_violation en `id`: el primer intento sí se aplicó
    // (solo se perdió la respuesta por un problema de red) y este segundo
    // insert chocó con la fila que ya existe — no es un fallo real.
    if (profileError?.code === "23505") {
      profileError = null;
    }
  }

  if (profileError) {
    console.error(
      `[registerAccount] usuario auth creado (id=${signUpData.user.id}) pero falló profiles tras reintento:`,
      profileError,
    );
    return {
      status: "error",
      message:
        "Tu cuenta se creó pero no pudimos guardar tu perfil. Escríbenos a team@clhglobal.org con tu correo para resolverlo.",
    };
  }

  // Correo propio de BeWay (distinto del enlace de confirmación de Supabase
  // Auth) — nunca bloquea el registro si Resend falla.
  await sendPreRegistrationEmail(data.email, data.fullName);

  if (!signUpData.session) {
    return { status: "confirm_email", email: data.email };
  }

  return { status: "success" };
}
