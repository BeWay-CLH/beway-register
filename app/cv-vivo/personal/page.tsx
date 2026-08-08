import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { getCatalog } from "@/lib/catalogs";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { PersonalForm } from "@/components/forms/PersonalForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function PersonalPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const academicStatuses = await getCatalog("academic_status");
  const { position, total } = getStagePosition("personal");

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Información personal</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Nos ayuda a que las empresas sepan cómo contactarte y en qué punto de tu formación estás.
        </p>
      </div>
      <PersonalForm
        academicStatuses={academicStatuses.map((a) => ({ value: a.id, label: a.name }))}
        defaultValues={{ phone: profile.phone ?? "", academicStatusId: profile.academic_status_id ?? undefined }}
      />
    </div>
  );
}
