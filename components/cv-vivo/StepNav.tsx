import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { WizardProgress } from "@/lib/cv-vivo/progress";

// Hexágono que retoma la marca (BeWay Design System > components/navigation/
// StepNav) — clip-path no admite borde, así que el estado "todo" se dibuja
// como dos hexágonos apilados (uno de borde, uno interior más chico).
const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

type MarkerState = "done" | "current" | "todo";

function StepMarker({ state, index }: { state: MarkerState; index: number }) {
  if (state === "done") {
    return (
      <span className="relative grid h-7 w-7 shrink-0 place-items-center">
        <span className="absolute inset-0 bg-brand-cyan" style={{ clipPath: HEX_CLIP }} />
        <Check size={14} strokeWidth={3} className="relative text-brand-dark" />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative grid h-7 w-7 shrink-0 place-items-center">
        <span className="absolute inset-0 bg-brand-gradient-soft shadow-glow" style={{ clipPath: HEX_CLIP }} />
        <span className="relative font-heading text-xs font-bold text-white">{index}</span>
      </span>
    );
  }
  return (
    <span className="relative grid h-7 w-7 shrink-0 place-items-center">
      <span className="absolute inset-0 bg-brand-gray-200" style={{ clipPath: HEX_CLIP }} />
      <span className="absolute inset-0 scale-[0.86] bg-surface-card" style={{ clipPath: HEX_CLIP }} />
      <span className="relative font-heading text-xs font-semibold text-text-muted">{index}</span>
    </span>
  );
}

type StepNavProps = {
  progress: WizardProgress;
  currentSlug: string | undefined;
  /** Slot fijo al pie, bajo una línea divisoria — enlaces de cuenta/ayuda. */
  footer?: ReactNode;
};

// Riel de progreso vertical (BeWay Design System > components/navigation/
// StepNav): marcadores hexagonales que retoman la marca en vez del stepper
// genérico anterior. Reemplaza el <aside> plano de WizardChrome.
export function StepNav({ progress, currentSlug, footer }: StepNavProps) {
  const { stages, completedCount, totalCount, percent } = progress;

  return (
    <nav
      aria-label="Etapas del CV Vivo"
      className="flex w-full flex-col gap-5 rounded-lg border border-border-subtle bg-surface-card p-5 shadow-sm"
    >
      <div>
        <p className="font-body text-eyebrow uppercase text-text-muted">Tu CV Vivo</p>
        <div className="mb-3 mt-1.5 flex items-baseline gap-1.5">
          <span className="font-heading text-[34px] font-bold leading-none tracking-display text-text-heading">
            {percent}%
          </span>
          <span className="font-heading text-[15px] font-semibold text-text-muted">completo</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-surface-sunken">
          <div
            className="h-full rounded-pill bg-brand-gradient-soft shadow-glow-sm transition-all duration-slow ease-out"
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
        <p className="mt-2 font-body text-[12px] text-text-muted">
          {completedCount} de {totalCount} secciones completadas
        </p>
      </div>

      <ol className="relative m-0 flex list-none flex-col p-0">
        {stages.map((stage, index) => {
          const isActive = stage.slug === currentSlug;
          const state: MarkerState = stage.isComplete ? "done" : isActive ? "current" : "todo";
          const isLast = index === stages.length - 1;

          return (
            <li key={stage.slug} className="relative">
              {!isLast && (
                <span
                  className={clsx(
                    // Centrado bajo el hexágono: padding izquierdo del Link
                    // (px-3 = 12px) + mitad del marcador (w-7 = 28px → 14px)
                    // - mitad del grosor de la línea (w-0.5 = 2px → 1px).
                    "absolute bottom-[-6px] left-[25px] top-8 w-0.5 rounded-full",
                    state === "done" ? "bg-brand-cyan" : "bg-border-subtle",
                  )}
                />
              )}
              <Link
                href={`/cv-vivo/${stage.slug}`}
                aria-current={isActive ? "step" : undefined}
                className={clsx(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-fast ease-standard",
                  isActive ? "bg-surface-accent-subtle" : "hover:bg-surface-sunken",
                )}
              >
                {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-pill bg-brand-cyan" />}
                <StepMarker state={state} index={stage.order - 1} />
                <span
                  className={clsx(
                    "truncate text-small leading-tight",
                    isActive
                      ? "font-heading font-bold tracking-tight text-text-heading"
                      : state === "done"
                        ? "font-body font-medium text-text-body"
                        : "font-body text-text-muted",
                  )}
                >
                  {stage.label}
                </span>
                {state === "done" && (
                  <span className="ml-auto shrink-0 font-body text-[11px] font-semibold uppercase tracking-caps text-brand-cyan-600">
                    Ok
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {footer && <div className="border-t border-border-subtle pt-4">{footer}</div>}
    </nav>
  );
}
