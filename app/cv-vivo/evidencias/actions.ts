"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { evidenceEntrySchema, type EvidenceEntryInput } from "@/lib/validations/cv-vivo/evidencias";

export async function saveEvidenceEntry(input: EvidenceEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = evidenceEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { id, label, url } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("evidences")
      .update({ label, url })
      .eq("id", id)
      .eq("profile_id", userId);

    if (error) {
      return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
    }
    return { status: "success" };
  }

  const { error } = await supabase.from("evidences").insert({ profile_id: userId, label, url });

  if (error) {
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteEvidenceEntry(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("evidences").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
