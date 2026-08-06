"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { WizardProgress } from "@/lib/cv-vivo/progress";

type WizardChromeProps = {
  progress: WizardProgress;
  children: ReactNode;
};

// Chrome compartido de todo el wizard: barra de completitud + stepper de
// las 10 etapas (CLAUDE.md > UX del wizard). Es "use client" porque
// necesita usePathname() para resaltar la etapa activa.
export function WizardChrome({ progress, children }: WizardChromeProps) {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/")[2];

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-6 border-b border-border-subtle bg-surface-card px-6 py-8 md:w-72 md:shrink-0 md:border-b-0 md:border-r md:px-8 md:py-12">
        <div>
          <p className="font-body text-small font-semibold text-text-body">
            Tu CV Vivo está {progress.percent}% completo
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-surface-sunken">
            <div
              className="h-full rounded-pill bg-brand-cyan transition-all duration-base ease-standard"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <nav aria-label="Etapas del CV Vivo">
          <ol className="flex flex-col gap-1">
            {progress.stages.map(({ slug, order, label, implemented, isComplete }) => {
              const isActive = slug === currentSlug;
              return (
                <li key={slug}>
                  <Link
                    href={`/cv-vivo/${slug}`}
                    className={clsx(
                      "flex items-center gap-3 rounded-md px-3 py-2 font-body text-small transition-colors duration-fast ease-standard",
                      isActive
                        ? "bg-surface-accent-subtle font-semibold text-text-body"
                        : implemented
                          ? "text-text-body hover:bg-surface-sunken"
                          : "text-text-muted hover:bg-surface-sunken",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border font-body text-[11px]",
                        isComplete
                          ? "border-brand-cyan bg-brand-cyan text-brand-dark"
                          : "border-border-strong text-text-muted",
                      )}
                    >
                      {isComplete ? <Check size={12} strokeWidth={3} /> : order - 1}
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
      <main className="flex flex-1 flex-col items-center px-6 py-12 md:px-16 md:py-16">{children}</main>
    </div>
  );
}
