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
//
// Antes esto eran 9 consultas de conteo en paralelo (una por tabla); ahora
// es una sola ida y vuelta a la función get_wizard_progress en Postgres
// (ver supabase/migrations/20260808120000_wizard_progress_function.sql) —
// esto se ejecuta en cada navegación dentro del wizard, así que colapsar
// las idas y vueltas aquí tiene el mayor impacto en la sensación de
// velocidad de toda la app.
export const getWizardContext = cache(async (): Promise<WizardContext | null> => {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: progress, error } = await supabase
    .rpc("get_wizard_progress", { p_profile_id: profile.id })
    .single();

  if (error || !progress) {
    console.error("[getWizardContext] error inesperado calculando progreso:", error);
    throw new Error("No se pudo cargar tu progreso. Intenta de nuevo en un momento.");
  }

  return {
    profile,
    hasEducation: progress.has_education,
    hasExperience: progress.has_experience,
    hasProjects: progress.has_projects,
    hasSkills: progress.has_skills,
    hasLanguages: progress.has_languages,
    hasCertifications: progress.has_certifications,
    hasPreferences: progress.has_preferences,
    hasEvidences: progress.has_evidences,
    hasPrivacySettings: progress.has_privacy_settings,
  };
});
