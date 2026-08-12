import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { ExperienciaForm, type ExperienceEntry } from "@/components/forms/ExperienciaForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function ExperienciaPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

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
    <StageShell
      slug="experiencia"
      title="Experiencia"
      description="Muestra a las empresas el tipo de trabajo que ya has hecho, aunque sea poco. Hasta 3 experiencias laborales, prácticas o freelance."
      whyText="Tu experiencia permite emparejarte con internships y programas de empleo que valoran candidatos con aplicación práctica en el mundo real. Puedes editarla en cualquier momento desde tu perfil."
    >
      <ExperienciaForm
        entries={entries}
        experienceTypes={experienceTypes.map((t) => ({ value: t.id, label: t.name }))}
        sectors={sectors.map((s) => ({ value: s.id, label: s.name }))}
      />
    </StageShell>
  );
}
