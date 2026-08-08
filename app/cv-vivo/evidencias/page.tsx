import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { EvidenciasForm, type EvidenceEntry } from "@/components/forms/EvidenciasForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function EvidenciasPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const { position, total } = getStagePosition("evidencias");
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
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Evidencias</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Enlaces donde las empresas puedan ver tu trabajo real: portafolio, GitHub, LinkedIn u
          otros.
        </p>
      </div>
      <EvidenciasForm entries={entries} />
    </div>
  );
}
