import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { EducacionForm, type EducationEntry } from "@/components/forms/EducacionForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function EducacionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const supabase = await createClient();
  const [{ data: rows }, countries, studyFields, academicStatuses] = await Promise.all([
    supabase
      .from("education")
      .select("*, universities(name)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    getCatalog("countries"),
    getCatalog("study_fields"),
    getCatalog("academic_status"),
  ]);

  const entries: EducationEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    universityId: row.university_id,
    universityName: row.universities?.name ?? null,
    studyFieldId: row.study_field_id,
    academicStatusId: row.academic_status_id,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    isPrimary: row.is_primary,
    description: row.description,
  }));

  return (
    <StageShell
      slug="educacion"
      title="Educación"
      description="Ayuda a las empresas a entender tu formación y en qué etapa académica estás. Puedes agregar más de una institución."
      whyText="Tu formación permite emparejarte con programas y challenges de empresas que buscan tu perfil académico. Puedes editarla en cualquier momento desde tu perfil."
    >
      <EducacionForm
        entries={entries}
        countries={countries.map((c) => ({ value: c.id, label: c.name }))}
        studyFields={studyFields.map((s) => ({ value: s.id, label: s.name }))}
        academicStatuses={academicStatuses.map((a) => ({ value: a.id, label: a.name }))}
        prefill={{
          countryId: profile.country_id,
          universityId: profile.university_id,
          studyFieldId: profile.study_field_id,
          academicStatusId: profile.academic_status_id,
        }}
      />
    </StageShell>
  );
}
