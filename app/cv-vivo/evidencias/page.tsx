import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { EvidenciasForm, type EvidenceEntry } from "@/components/forms/EvidenciasForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function EvidenciasPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("evidences")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true });

  const entries: EvidenceEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    url: row.url,
  }));

  return (
    <StageShell
      slug="evidencias"
      title="Evidencias"
      description="Enlaces donde las empresas puedan ver tu trabajo real: portafolio, GitHub, LinkedIn u otros."
      whyText="Mostrar tu trabajo tangible permite que las empresas evalúen tus habilidades directamente y te contacten para oportunidades relevantes."
    >
      <EvidenciasForm entries={entries} />
    </StageShell>
  );
}
