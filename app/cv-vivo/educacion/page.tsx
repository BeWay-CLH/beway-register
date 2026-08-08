import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { EducacionForm, type EducationEntry } from "@/components/forms/EducacionForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function EducacionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const { position, total } = getStagePosition("educacion");
  const supabase = await createClient();
  const [{ data: rows }, universities, studyFields, academicStatuses] = await Promise.all([
    supabase
      .from("education")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    getCatalog("universities"),
    getCatalog("study_fields"),
    getCatalog("academic_status"),
  ]);

  const entries: EducationEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    universityId: row.university_id,
    studyFieldId: row.study_field_id,
    academicStatusId: row.academic_status_id,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    isPrimary: row.is_primary,
    description: row.description,
  }));

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Educación</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Tu formación académica — puedes agregar más de una.
        </p>
      </div>
      <EducacionForm
        entries={entries}
        universities={universities.map((u) => ({ value: u.id, label: u.name }))}
        studyFields={studyFields.map((s) => ({ value: s.id, label: s.name }))}
        academicStatuses={academicStatuses.map((a) => ({ value: a.id, label: a.name }))}
        prefill={{
          universityId: profile.university_id,
          studyFieldId: profile.study_field_id,
          academicStatusId: profile.academic_status_id,
        }}
      />
    </div>
  );
}
