"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestIp, ipRateLimit } from "@/lib/rate-limit";
import { rightsRequestSchema, type RightsRequestInput } from "@/lib/validations/rights-request";

export type SubmitRightsRequestResult =
  | { status: "success" }
  | { status: "error"; message: string };

// Server Action de /derechos (CLAUDE.md > Seguridad: rate limit + validación
// de servidor siempre). No requiere sesión — alguien puede pedir la
// eliminación de un lead que nunca llegó a confirmar su correo. El insert
// lo permite la policy pública "rights_requests_insert_public"
// (20260907090000_legal_consent_versions.sql); sin policy de lectura para
// anon/authenticated, así que no hace falta el cliente admin aquí.
export async function submitRightsRequest(
  input: RightsRequestInput,
): Promise<SubmitRightsRequestResult> {
  const ip = await getRequestIp();
  const { success: withinRateLimit } = await ipRateLimit.limit(ip);
  if (!withinRateLimit) {
    return {
      status: "error",
      message: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
    };
  }

  const parsed = rightsRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rights_requests").insert({
    request_type: parsed.data.requestType,
    email: parsed.data.email,
    details: parsed.data.details,
  });

  if (error) {
    console.error("[submitRightsRequest] error insertando solicitud:", error);
    return { status: "error", message: "No se pudo enviar tu solicitud. Intenta de nuevo." };
  }

  return { status: "success" };
}
