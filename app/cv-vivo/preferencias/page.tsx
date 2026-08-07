import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { PreferenciasForm } from "@/components/forms/PreferenciasForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function PreferenciasPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const supabase = await createClient();
  const [
    { data: preferences },
    { data: opportunityRows },
    { data: modalityRows },
    { data: sectorRows },
    availabilityOptions,
    opportunityTypes,
    workModalities,
    sectors,
  ] = await Promise.all([
    supabase.from("preferences").select("*").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("preference_opportunity_types").select("opportunity_type_id").eq("profile_id", profile.id),
    supabase.from("preference_work_modalities").select("work_modality_id").eq("profile_id", profile.id),
    supabase.from("preference_sectors").select("sector_id").eq("profile_id", profile.id),
    getCatalog("availability_options"),
    getCatalog("opportunity_types"),
    getCatalog("work_modalities"),
    getCatalog("sectors"),
  ]);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>Etapa 9 de 10</SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Preferencias profesionales</h1>
        <p className="mt-2 font-body text-body text-text-muted">Cuéntanos qué tipo de oportunidades buscas.</p>
      </div>
      <PreferenciasForm
        availabilityOptions={availabilityOptions.map((o) => ({ value: o.id, label: o.name }))}
        opportunityTypes={opportunityTypes.map((o) => ({ value: o.id, label: o.name }))}
        workModalities={workModalities.map((o) => ({ value: o.id, label: o.name }))}
        sectors={sectors.map((o) => ({ value: o.id, label: o.name }))}
        defaultValues={{
          availabilityOptionId: preferences?.availability_option_id ?? undefined,
          opportunityTypeIds: (opportunityRows ?? []).map((row) => row.opportunity_type_id),
          workModalityIds: (modalityRows ?? []).map((row) => row.work_modality_id),
          sectorIds: (sectorRows ?? []).map((row) => row.sector_id),
        }}
      />
    </div>
  );
}
