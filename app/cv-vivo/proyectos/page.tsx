import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { ProyectosForm, type ProjectEntry } from "@/components/forms/ProyectosForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function ProyectosPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const supabase = await createClient();
  const [{ data: rows }, projectTypes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    getCatalog("project_types"),
  ]);

  const entries: ProjectEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    projectTypeId: row.project_type_id,
    url: row.url,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
  }));

  return (
    <StageShell
      slug="proyectos"
      title="Proyectos y actividades"
      description="Destaca lo que has construido fuera del salón de clases. Hasta 3 proyectos, actividades extracurriculares o hackathons."
      whyText="Tus proyectos demuestran iniciativa y habilidades aplicadas más allá del aula. Las empresas valoran la experiencia práctica y la capacidad de llevar ideas a la realidad."
    >
      <ProyectosForm entries={entries} projectTypes={projectTypes.map((t) => ({ value: t.id, label: t.name }))} />
    </StageShell>
  );
}
