import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { ProyectosForm, type ProjectEntry } from "@/components/forms/ProyectosForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function ProyectosPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const { position, total } = getStagePosition("proyectos");
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
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Proyectos y actividades</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Hasta 3 proyectos, actividades extracurriculares o hackathons.
        </p>
      </div>
      <ProyectosForm entries={entries} projectTypes={projectTypes.map((t) => ({ value: t.id, label: t.name }))} />
    </div>
  );
}
