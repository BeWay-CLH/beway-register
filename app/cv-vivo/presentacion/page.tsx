import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { PresentacionForm } from "@/components/forms/PresentacionForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function PresentacionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>Etapa 3 de 10</SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Presentación</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Es lo primero que ven las empresas de tu perfil — hazlo breve y directo.
        </p>
      </div>
      <PresentacionForm
        defaultValues={{
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
        }}
      />
    </div>
  );
}
