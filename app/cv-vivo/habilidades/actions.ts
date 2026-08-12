"use server";

import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";
import {
  skillSchema,
  languageEntrySchema,
  type SkillInput,
  type LanguageEntryInput,
} from "@/lib/validations/cv-vivo/habilidades";

// Server Actions de la etapa 7. Ninguna de las dos tablas tiene límite de
// cantidad; ambas sí tienen una constraint unique (skills: nombre por
// perfil case-insensitive; languages: un idioma no se repite por perfil) —
// el código 23505 (unique_violation) se traduce a un mensaje claro.
export async function addSkill(input: SkillInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { error } = await supabase.from("skills").insert({ profile_id: userId, name: parsed.data.name });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "Ya agregaste esa habilidad." };
    }
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteSkill(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("skills").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function addLanguage(input: LanguageEntryInput): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const parsed = languageEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los datos del formulario." };
  }

  const { error } = await supabase.from("languages").insert({
    profile_id: userId,
    language_id: parsed.data.languageId,
    proficiency_level_id: parsed.data.proficiencyLevelId,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "Ya agregaste ese idioma." };
    }
    return { status: "error", message: "No se pudo guardar. Intenta de nuevo." };
  }
  return { status: "success" };
}

export async function deleteLanguage(id: string): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };
  const { supabase, userId } = auth;

  const { error } = await supabase.from("languages").delete().eq("id", id).eq("profile_id", userId);

  if (error) {
    return { status: "error", message: "No se pudo eliminar. Intenta de nuevo." };
  }
  return { status: "success" };
}
