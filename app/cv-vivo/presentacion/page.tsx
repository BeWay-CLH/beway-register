import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { PresentacionForm } from "@/components/forms/PresentacionForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function PresentacionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  return (
    <StageShell
      slug="presentacion"
      title="Presentación"
      description="Es lo primero que ven las empresas de tu perfil — hazlo breve y directo."
      whyText="Tu titular y biografía son el primer contacto con las empresas. Una presentación clara aumenta tu visibilidad para oportunidades relevantes."
    >
      <PresentacionForm
        defaultValues={{
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
        }}
      />
    </StageShell>
  );
}
