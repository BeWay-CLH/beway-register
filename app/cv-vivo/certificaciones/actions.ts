"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
import { certificationEntrySchema, type CertificationEntryInput } from "@/lib/validations/cv-vivo/certificaciones";

export async function saveCertificationEntry(input: CertificationEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = certificationEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { id, name, certificationTypeId, institution, issueDate, credentialUrl } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("certifications")
      .update({
        name,
        certification_type_id: certificationTypeId,
        institution,
        issue_date: issueDate,
        credential_url: credentialUrl,
      })
      .eq("id", id)
      .eq("profile_id", userId);

    if (error) {
      return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
    }
    return { status: "success" };
  }

  const { error } = await supabase.from("certifications").insert({
    profile_id: userId,
    name,
    certification_type_id: certificationTypeId,
    institution,
    issue_date: issueDate,
    credential_url: credentialUrl,
  });

  if (error) {
    if (error.code === "23514") {
      return { status: "error", message: `Ya alcanzaste el máximo de ${MAX_REPEATABLE_ENTRIES} certificaciones.` };
    }
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteCertificationEntry(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("certifications").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
