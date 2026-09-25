import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type CvPdfEducation = {
  studyField: string | null;
  university: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
};

export type CvPdfExperience = {
  roleTitle: string;
  companyName: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
};

export type CvPdfProject = {
  name: string;
  typeName: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  url: string | null;
};

export type CvPdfCertification = {
  name: string;
  institution: string | null;
  typeName: string | null;
  issueDate: string | null;
};

export type CvPdfLanguage = { name: string; proficiency: string | null };
export type CvPdfEvidence = { label: string; url: string };

export type CvPdfData = {
  fullName: string;
  headline: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  countryName: string | null;
  universityName: string | null;
  education: CvPdfEducation[];
  experiences: CvPdfExperience[];
  projects: CvPdfProject[];
  certifications: CvPdfCertification[];
  skills: string[];
  languages: CvPdfLanguage[];
  evidences: CvPdfEvidence[];
};

// Datos para el CV en PDF (feedback de negocio: "generar un CV en PDF
// diseñado por BeWay con toda la información del perfil"). A diferencia de
// exportMyData (JSON crudo con IDs, para portabilidad GDPR), acá se
// resuelven los nombres de catálogo — es un documento para leer, no para
// re-importar. Sin preferencias profesionales: son para el matching interno
// de BeWay, no algo que aparezca en un CV convencional para aplicar afuera.
export async function getCvPdfData(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<CvPdfData | null> {
  const [
    { data: profile },
    { data: educationRows },
    { data: experienceRows },
    { data: projectRows },
    { data: certificationRows },
    { data: skillRows },
    { data: languageRows },
    { data: evidenceRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, countries!country_id(name), universities(name)")
      .eq("id", profileId)
      .single(),
    supabase
      .from("education")
      .select("*, universities(name), study_fields(name)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true }),
    supabase.from("experiences").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
    supabase
      .from("projects")
      .select("*, project_types(name)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true }),
    supabase
      .from("certifications")
      .select("*, certification_types(name)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true }),
    supabase.from("skills").select("name").eq("profile_id", profileId).order("created_at", { ascending: true }),
    supabase
      .from("languages")
      .select("*, languages_catalog(name), proficiency_levels(name)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true }),
    supabase.from("evidences").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
  ]);

  if (!profile) return null;

  return {
    fullName: profile.full_name,
    headline: profile.headline,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone,
    countryName: profile.countries?.name ?? null,
    universityName: profile.universities?.name ?? null,
    education: (educationRows ?? []).map((row) => ({
      studyField: row.study_fields?.name ?? null,
      university: row.universities?.name ?? null,
      startDate: row.start_date,
      endDate: row.end_date,
      isCurrent: row.is_current,
      description: row.description,
    })),
    experiences: (experienceRows ?? []).map((row) => ({
      roleTitle: row.role_title,
      companyName: row.company_name,
      startDate: row.start_date,
      endDate: row.end_date,
      isCurrent: row.is_current,
      description: row.description,
    })),
    projects: (projectRows ?? []).map((row) => ({
      name: row.name,
      typeName: row.project_types?.name ?? null,
      startDate: row.start_date,
      endDate: row.end_date,
      description: row.description,
      url: row.url,
    })),
    certifications: (certificationRows ?? []).map((row) => ({
      name: row.name,
      institution: row.institution,
      typeName: row.certification_types?.name ?? null,
      issueDate: row.issue_date,
    })),
    skills: (skillRows ?? []).map((row) => row.name),
    languages: (languageRows ?? []).map((row) => ({
      name: row.languages_catalog?.name ?? "Idioma",
      proficiency: row.proficiency_levels?.name ?? null,
    })),
    evidences: (evidenceRows ?? []).map((row) => ({ label: row.label, url: row.url })),
  };
}
