import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow, WizardContext } from "@/lib/cv-vivo/stages";

// Perfil del usuario autenticado, cacheado por request con React `cache()`
// — el layout del wizard y cada página de etapa lo llaman por separado,
// pero comparten la misma consulta dentro de un mismo render del servidor.
// null si no hay sesión o no existe la fila de profiles (el layout redirige
// en ese caso, ver app/cv-vivo/layout.tsx).
export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  // PGRST116 = "no existe la fila" (perfil realmente no creado — el único
  // caso donde null es correcto). Cualquier otro error es de conexión/RLS y
  // NO debe tratarse igual: los callers redirigen a /registro si esto
  // devuelve null, y como no hay /login, un usuario ya registrado quedaría
  // atrapado ("ya existe una cuenta con ese correo", sin forma de entrar).
  if (error && error.code !== "PGRST116") {
    console.error("[getCurrentProfile] error inesperado consultando profiles:", error);
    throw new Error("No se pudo cargar tu perfil. Intenta de nuevo en un momento.");
  }

  return profile;
});

// Contexto de completitud del wizard (ver lib/cv-vivo/stages.ts >
// WizardContext) — agrega a getCurrentProfile las señales de las tablas
// hijas que cada etapa implementada necesita. Cacheado por request.
export const getWizardContext = cache(async (): Promise<WizardContext | null> => {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const [
    educationResult,
    experienceResult,
    projectsResult,
    skillsResult,
    languagesResult,
    certificationsResult,
    preferencesResult,
    evidencesResult,
    privacySettingsResult,
  ] = await Promise.all([
    supabase.from("education").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("experiences").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("languages").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("certifications").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("preferences").select("availability_option_id").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("evidences").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("privacy_settings").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
  ]);

  // Un error real (no "0 filas") aquí no debe leerse como "etapa vacía" —
  // reportaría el wizard como menos completo de lo que realmente está.
  const failedError = [
    educationResult.error,
    experienceResult.error,
    projectsResult.error,
    skillsResult.error,
    languagesResult.error,
    certificationsResult.error,
    preferencesResult.error,
    evidencesResult.error,
    privacySettingsResult.error,
  ].find(Boolean);

  if (failedError) {
    console.error("[getWizardContext] error inesperado calculando progreso:", failedError);
    throw new Error("No se pudo cargar tu progreso. Intenta de nuevo en un momento.");
  }

  return {
    profile,
    hasEducation: (educationResult.count ?? 0) > 0,
    hasExperience: (experienceResult.count ?? 0) > 0,
    hasProjects: (projectsResult.count ?? 0) > 0,
    hasSkills: (skillsResult.count ?? 0) > 0,
    hasLanguages: (languagesResult.count ?? 0) > 0,
    hasCertifications: (certificationsResult.count ?? 0) > 0,
    hasPreferences: preferencesResult.data?.availability_option_id != null,
    hasEvidences: (evidencesResult.count ?? 0) > 0,
    hasPrivacySettings: (privacySettingsResult.count ?? 0) > 0,
  };
});
