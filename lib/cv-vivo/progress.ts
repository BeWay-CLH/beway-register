import { WIZARD_STAGES, type ProfileRow } from "@/lib/cv-vivo/stages";

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
  nextIncompleteSlug: string | null;
};

// Barra de completitud (CLAUDE.md > UX del wizard): "Tu CV Vivo está X%
// completo". % sobre las 10 etapas totales, no solo las implementadas —
// así el número es honesto sobre cuánto falta y sube solo cuando el
// usuario realmente llena una etapa (o cuando el equipo publica una etapa
// nueva y el usuario la completa), nunca por cambios de código.
export function getWizardProgress(profile: ProfileRow): WizardProgress {
  const stages: StageProgress[] = WIZARD_STAGES.map((stage) => ({
    slug: stage.slug,
    order: stage.order,
    label: stage.label,
    implemented: stage.implemented,
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
    nextIncompleteSlug: nextIncomplete?.slug ?? null,
  };
}
