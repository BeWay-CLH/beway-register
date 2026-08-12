import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { PrivacidadForm } from "@/components/forms/PrivacidadForm";
import { StageShell } from "@/components/cv-vivo/StageShell";
import type { PrivacySettingsInput } from "@/lib/validations/cv-vivo/privacidad";

export default async function PrivacidadPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

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

  return (
    <StageShell
      slug="privacidad"
      title="Privacidad"
      description="Define quién puede ver tu perfil y tus datos de contacto."
      whyText="Controlas quién accede a tu información. Las empresas respetan tu privacidad y solo verán los datos que decidas compartir."
    >
      <PrivacidadForm defaultValues={defaultValues} />
    </StageShell>
  );
}
