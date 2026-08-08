"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { privacySettingsSchema, type PrivacySettingsInput } from "@/lib/validations/cv-vivo/privacidad";

// Server Action de la etapa 11, la última del wizard. privacy_settings es
// 1:1 con profiles (profile_id como PK) — sin tablas puente, un solo upsert.
export async function savePrivacySettings(input: PrivacySettingsInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = privacySettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { error } = await supabase.from("privacy_settings").upsert({
    profile_id: userId,
    profile_visibility: parsed.data.profileVisibility,
    show_contact_email: parsed.data.showContactEmail,
    show_contact_phone: parsed.data.showContactPhone,
  });

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}
