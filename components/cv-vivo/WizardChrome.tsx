"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UserCircle } from "lucide-react";
import type { WizardProgress } from "@/lib/cv-vivo/progress";
import { StepNav } from "@/components/cv-vivo/StepNav";

type WizardChromeProps = {
  progress: WizardProgress;
  children: ReactNode;
};

// Chrome compartido de todo el wizard: StepNav (BeWay Design System >
// components/navigation/StepNav — CLAUDE.md > UX del wizard) como tarjeta
// flotante en vez del <aside> plano anterior. Es "use client" porque
// necesita usePathname() para resaltar la etapa activa.
export function WizardChrome({ progress, children }: WizardChromeProps) {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/")[2];

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:gap-8 md:px-8 md:py-10">
      <div className="md:sticky md:top-10 md:w-[280px] md:shrink-0">
        <StepNav
          progress={progress}
          currentSlug={currentSlug}
          footer={
            <Link
              href="/cuenta"
              className="flex items-center gap-2 rounded-md px-3 py-2 font-body text-small text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-text-body"
            >
              <UserCircle size={16} />
              Mi cuenta
            </Link>
          }
        />
      </div>
      <main className="flex flex-1 flex-col items-center py-2">{children}</main>
    </div>
  );
}
