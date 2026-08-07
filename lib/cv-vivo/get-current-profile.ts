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

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

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
    { count: educationCount },
    { count: experienceCount },
    { count: projectsCount },
    { count: skillsCount },
    { count: languagesCount },
    { count: certificationsCount },
  ] = await Promise.all([
    supabase.from("education").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("experiences").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("languages").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
    supabase.from("certifications").select("*", { count: "exact", head: true }).eq("profile_id", profile.id),
  ]);

  return {
    profile,
    hasEducation: (educationCount ?? 0) > 0,
    hasExperience: (experienceCount ?? 0) > 0,
    hasProjects: (projectsCount ?? 0) > 0,
    hasSkills: (skillsCount ?? 0) > 0,
    hasLanguages: (languagesCount ?? 0) > 0,
    hasCertifications: (certificationsCount ?? 0) > 0,
  };
});
