"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser, type SaveStageResult } from "@/lib/cv-vivo/require-user";

// Cierra sesión y vuelve al landing — sin datos sensibles de por medio, no
// necesita el guard de requireUser() (rate limit + validación de sesión).
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// Exportación de datos (CLAUDE.md > Privacidad y GDPR): toda la información
// que el usuario cargó, en un único JSON descargable desde el cliente. Una
// consulta por tabla en paralelo — este perfil nunca tiene más de un puñado
// de filas por tabla (máx. 3 en las repetibles), así que no hace falta una
// función de Postgres como en get_wizard_progress.
export async function exportMyData() {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error" as const, message: auth.message };
  const { supabase, userId } = auth;

  const [
    profile,
    education,
    experiences,
    projects,
    certifications,
    skills,
    languages,
    evidences,
    preferences,
    opportunityTypeRows,
    workModalityRows,
    sectorRows,
    privacySettings,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("education").select("*").eq("profile_id", userId),
    supabase.from("experiences").select("*").eq("profile_id", userId),
    supabase.from("projects").select("*").eq("profile_id", userId),
    supabase.from("certifications").select("*").eq("profile_id", userId),
    supabase.from("skills").select("*").eq("profile_id", userId),
    supabase.from("languages").select("*").eq("profile_id", userId),
    supabase.from("evidences").select("*").eq("profile_id", userId),
    supabase.from("preferences").select("*").eq("profile_id", userId).maybeSingle(),
    supabase.from("preference_opportunity_types").select("opportunity_type_id").eq("profile_id", userId),
    supabase.from("preference_work_modalities").select("work_modality_id").eq("profile_id", userId),
    supabase.from("preference_sectors").select("sector_id").eq("profile_id", userId),
    supabase.from("privacy_settings").select("*").eq("profile_id", userId).maybeSingle(),
  ]);

  if (profile.error) {
    return { status: "error" as const, message: "No se pudo exportar tu información. Intenta de nuevo." };
  }

  return {
    status: "success" as const,
    data: {
      exportedAt: new Date().toISOString(),
      profile: profile.data,
      education: education.data ?? [],
      experiences: experiences.data ?? [],
      projects: projects.data ?? [],
      certifications: certifications.data ?? [],
      skills: skills.data ?? [],
      languages: languages.data ?? [],
      evidences: evidences.data ?? [],
      preferences: preferences.data && {
        ...preferences.data,
        opportunityTypeIds: (opportunityTypeRows.data ?? []).map((row) => row.opportunity_type_id),
        workModalityIds: (workModalityRows.data ?? []).map((row) => row.work_modality_id),
        sectorIds: (sectorRows.data ?? []).map((row) => row.sector_id),
      },
      privacySettings: privacySettings.data,
    },
  };
}

// Eliminación de cuenta (CLAUDE.md > Privacidad y GDPR): borrado real, no
// anonimización — auth.users tiene "on delete cascade" hacia profiles, y
// profiles hacia el resto de las tablas del perfil, así que borrar el
// usuario de Auth arrastra todo su CV Vivo en una sola operación.
export async function deleteMyAccount(): Promise<SaveStageResult> {
  const auth = await requireUser();
  if (!auth.ok) return { status: "error", message: auth.message };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(auth.userId);

  if (error) {
    console.error("[deleteMyAccount] error eliminando el usuario:", error);
    return {
      status: "error",
      message: "No se pudo eliminar tu cuenta. Escríbenos a team@clhglobal.org si el problema persiste.",
    };
  }

  // deleteUser() borra el usuario en Auth pero no la sesión de este
  // navegador — sin esto, las cookies seguirían pareciendo válidas hasta que
  // expiren y el próximo request fallaría de forma confusa.
  await auth.supabase.auth.signOut();

  return { status: "success" };
}
