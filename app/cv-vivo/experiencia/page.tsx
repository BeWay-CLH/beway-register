import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { ExperienciaForm, type ExperienceEntry } from "@/components/forms/ExperienciaForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function ExperienciaPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const supabase = await createClient();
  const [{ data: rows }, experienceTypes, sectors] = await Promise.all([
    supabase
      .from("experiences")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    getCatalog("experience_types"),
    getCatalog("sectors"),
  ]);

  const entries: ExperienceEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    companyName: row.company_name,
    roleTitle: row.role_title,
    experienceTypeId: row.experience_type_id,
    sectorId: row.sector_id,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    description: row.description,
  }));

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>Etapa 5 de 10</SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Experiencia</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Hasta 3 experiencias laborales, prácticas o freelance.
        </p>
      </div>
      <ExperienciaForm
        entries={entries}
        experienceTypes={experienceTypes.map((t) => ({ value: t.id, label: t.name }))}
        sectors={sectors.map((s) => ({ value: s.id, label: s.name }))}
      />
    </div>
  );
}
