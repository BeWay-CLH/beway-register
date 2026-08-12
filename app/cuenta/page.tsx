import { redirect } from "next/navigation";
import { getWizardContext } from "@/lib/cv-vivo/get-current-profile";
import { getWizardProgress } from "@/lib/cv-vivo/progress";
import { CuentaActions } from "@/components/forms/CuentaActions";
import { Card } from "@/components/ui/Card";

export default async function CuentaPage() {
  const context = await getWizardContext();
  if (!context) redirect("/iniciar-sesion");

  const { profile } = context;
  const progress = getWizardProgress(context);
  const memberSince = new Date(profile.created_at).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16 md:py-24">
      <div className="flex w-full max-w-md flex-col gap-2 text-center">
        <h1 className="font-heading text-h1 text-brand-dark">Tu cuenta</h1>
        <p className="font-body text-body text-text-muted">
          Gestiona tu perfil de BeWay: exporta tus datos o elimina tu cuenta (GDPR).
        </p>
      </div>

      <Card elevation="sm" className="flex w-full max-w-md flex-col gap-1">
        <p className="font-body text-body font-semibold text-text-body">{profile.full_name}</p>
        <p className="font-body text-small text-text-muted">{profile.email}</p>
        <p className="mt-2 font-body text-small text-text-muted">
          Miembro desde {memberSince} · Tu CV Vivo está {progress.percent}% completo
        </p>
      </Card>

      <CuentaActions />
    </main>
  );
}
