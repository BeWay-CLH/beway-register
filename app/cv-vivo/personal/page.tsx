import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { getCatalog } from "@/lib/catalogs";
import { PersonalForm } from "@/components/forms/PersonalForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function PersonalPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const [academicStatuses, countries] = await Promise.all([
    getCatalog("academic_status"),
    getCatalog("countries"),
  ]);

  return (
    <StageShell
      slug="personal"
      title="Información personal"
      description="Nos ayuda a que las empresas sepan cómo contactarte y en qué punto de tu formación estás."
      whyText="Necesitamos tu teléfono para que las empresas puedan contactarte. Tu situación académica nos ayuda a encontrar oportunidades que se ajusten a tu etapa formativa."
    >
      <PersonalForm
        academicStatuses={academicStatuses.map((a) => ({ value: a.id, label: a.name }))}
        countries={countries.map((c) => ({
          value: c.id,
          label: c.calling_code ? `${c.calling_code} ${c.name}` : c.name,
        }))}
        defaultValues={{
          phoneCountryId: profile.phone_country_id ?? "",
          phone: profile.phone ?? "",
          academicStatusId: profile.academic_status_id ?? undefined,
        }}
      />
    </StageShell>
  );
}
