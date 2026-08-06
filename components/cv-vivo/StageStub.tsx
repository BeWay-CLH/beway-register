import { WIZARD_STAGES } from "@/lib/cv-vivo/stages";
import { SectionLabel } from "@/components/ui/SectionLabel";

type StageStubProps = {
  slug: string;
};

// Placeholder para las etapas que todavía no tienen formulario real (ver
// lib/cv-vivo/stages.ts > implemented: false). Mantiene la etapa navegable
// desde el stepper mientras se construye.
export function StageStub({ slug }: StageStubProps) {
  const stage = WIZARD_STAGES.find((s) => s.slug === slug);
  if (!stage) return null;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
      <SectionLabel align="center">
        Etapa {stage.order - 1} de {WIZARD_STAGES.length}
      </SectionLabel>
      <h1 className="font-heading text-h1 text-brand-dark">{stage.label}</h1>
      <p className="font-body text-body text-text-muted">{stage.description}</p>
      <p className="font-body text-small text-text-muted">
        Esta etapa todavía no está disponible. Vuelve pronto.
      </p>
    </div>
  );
}
