import { WIZARD_STAGES, type ProfileRow, type WizardStage } from "@/lib/cv-vivo/stages";

export type StageProgress = {
  stage: WizardStage;
  isComplete: boolean;
};

export type WizardProgress = {
  stages: StageProgress[];
  completedCount: number;
  totalCount: number;
  percent: number;
  nextIncompleteSlug: string | null;
};

// Barra de completitud (CLAUDE.md > UX del wizard): "Tu CV Vivo está X%
// completo". % sobre las 10 etapas totales, no solo las implementadas —
// así el número es honesto sobre cuánto falta y sube solo cuando el
// usuario realmente llena una etapa (o cuando el equipo publica una etapa
// nueva y el usuario la completa), nunca por cambios de código.
export function getWizardProgress(profile: ProfileRow): WizardProgress {
  const stages = WIZARD_STAGES.map((stage) => ({
    stage,
    isComplete: stage.isComplete(profile),
  }));

  const completedCount = stages.filter((s) => s.isComplete).length;
  const totalCount = stages.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const nextIncomplete = stages.find((s) => !s.isComplete);

  return {
    stages,
    completedCount,
    totalCount,
    percent,
    nextIncompleteSlug: nextIncomplete?.stage.slug ?? null,
  };
}

export function getNextStageSlug(currentSlug: string): string | null {
  const index = WIZARD_STAGES.findIndex((s) => s.slug === currentSlug);
  if (index === -1 || index === WIZARD_STAGES.length - 1) return null;
  return WIZARD_STAGES[index + 1].slug;
}
