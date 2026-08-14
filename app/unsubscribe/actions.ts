"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ConfirmUnsubscribeResult = { status: "success" } | { status: "error"; message: string };

// Baja de un clic desde un correo de comunicación (#3/#4/#5/#7,
// docs/email-strategy.md). Quien abre el enlace no tiene sesión, así que
// no puede pasar por requireUser() — profiles.unsubscribe_token (un UUID
// aleatorio, ver lib/email/unsubscribe.ts) es la única prueba de
// identidad, revalidada acá independientemente de la página que la
// mostró: nunca confiar en que el cliente no manipuló el token del
// formulario.
export async function confirmUnsubscribe(token: string): Promise<ConfirmUnsubscribeResult> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ marketing_consent: false })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[confirmUnsubscribe] no se pudo actualizar marketing_consent:", error);
    return { status: "error", message: "No se pudo procesar tu baja. Intenta de nuevo." };
  }
  if (!data) {
    return { status: "error", message: "Este enlace no es válido o ya expiró." };
  }

  return { status: "success" };
}
