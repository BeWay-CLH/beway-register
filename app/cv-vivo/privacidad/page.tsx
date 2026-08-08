import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { PrivacidadForm } from "@/components/forms/PrivacidadForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { PrivacySettingsInput } from "@/lib/validations/cv-vivo/privacidad";

export default async function PrivacidadPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const supabase = await createClient();
  const { data: privacy } = await supabase
    .from("privacy_settings")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const defaultValues: PrivacySettingsInput = {
    profileVisibility:
      (privacy?.profile_visibility as PrivacySettingsInput["profileVisibility"]) ?? "companies_only",
    showContactEmail: privacy?.show_contact_email ?? false,
    showContactPhone: privacy?.show_contact_phone ?? false,
  };

  const { position, total } = getStagePosition("privacidad");

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Privacidad</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Última etapa — define quién puede ver tu perfil y tus datos de contacto.
        </p>
      </div>
      <PrivacidadForm defaultValues={defaultValues} />
    </div>
  );
}
