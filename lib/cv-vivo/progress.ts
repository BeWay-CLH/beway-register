import { WIZARD_STAGES, type WizardContext } from "@/lib/cv-vivo/stages";

// Forma plana y serializable — nunca incluye WizardStage.isComplete (una
// función). WizardChrome es "use client": un Server Component no puede
// pasarle una función como prop, solo datos.
export type StageProgress = {
  slug: string;
  order: number;
  label: string;
  implemented: boolean;
  isComplete: boolean;
};

export type WizardProgress = {
  stages: StageProgress[];
  completedCount: number;
  totalCount: number;
  percent: number;
  /** Siguiente etapa implementada e incompleta; si no hay ninguna (todo lo
   * publicado está completo), cae en la última etapa implementada — nunca
   * en un stub, y nunca null (WIZARD_STAGES no está vacío). */
  nextIncompleteSlug: string;
};

// Barra de completitud (CLAUDE.md > UX del wizard): "Tu CV Vivo está X%
// completo". % sobre las 10 etapas totales, no solo las implementadas —
// así el número es honesto sobre cuánto falta y sube solo cuando el
// usuario realmente llena una etapa (o cuando el equipo publica una etapa
// nueva y el usuario la completa), nunca por cambios de código.
export function getWizardProgress(ctx: WizardContext): WizardProgress {
  const stages: StageProgress[] = WIZARD_STAGES.map((stage) => ({
    slug: stage.slug,
    order: stage.order,
    label: stage.label,
    implemented: stage.implemented,
    isComplete: stage.isComplete(ctx),
  }));

  const completedCount = stages.filter((s) => s.isComplete).length;
  const totalCount = stages.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  // Solo etapas implementadas pueden ser "la siguiente" — un stub nunca
  // debe interceptar la navegación. Si ya se completó todo lo publicado,
  // el fallback es la última etapa implementada, no la primera del wizard.
  const implementedStages = stages.filter((s) => s.implemented);
  const nextIncomplete = implementedStages.find((s) => !s.isComplete);
  const fallbackSlug = implementedStages.at(-1)?.slug ?? stages[0].slug;

  return {
    stages,
    completedCount,
    totalCount,
    percent,
    nextIncompleteSlug: nextIncomplete?.slug ?? fallbackSlug,
  };
}
