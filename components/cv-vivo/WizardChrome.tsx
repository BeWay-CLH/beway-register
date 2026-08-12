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
//
// Desde md: el contenedor se saca del flujo normal del documento
// (md:fixed md:inset-0) y cada columna maneja su propio scroll por
// separado (md:overflow-y-auto) — el sidebar queda fijo en pantalla, solo
// el formulario se desplaza. En mobile no aplica: se apilan y la página
// entera se desplaza como siempre, más natural en una pantalla chica.
//
// md:fixed (no md:h-screen + flex-item) a propósito: probado con
// Playwright, con h-screen dentro del <body> flex-col de globals.css el
// <html> igual terminaba con ~41px de scroll extra (measure real: la
// altura de un flex item con height explícita puede no propagar
// limpiamente al <html>, aunque cada columna internamente ya estuviera
// bien contenida) — ese remanente arrastraba al sidebar al hacer scroll.
// position:fixed saca el contenedor del flujo por completo, sin ninguna
// ambigüedad de cuánto mide <body>/<html>.
//
// Sin padding-bottom desde md en el contenedor exterior ni en <main>: la
// barra fija de StageShell (sticky bottom-0) se pega al borde de <main> —
// si ese borde queda 40px por encima del borde real de la ventana (por el
// padding), la barra se pega ahí y deja un hueco visible debajo (probado
// con Playwright: 40px exactos, el mismo valor de md:py-10). El respiro
// inferior se conserva solo en el sidebar, que no tiene este problema.
export function WizardChrome({ progress, children }: WizardChromeProps) {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/")[2];

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:fixed md:inset-0 md:flex-row md:items-stretch md:gap-8 md:overflow-hidden md:px-8 md:pb-0 md:pt-10">
      <div className="md:h-full md:w-[280px] md:shrink-0 md:overflow-y-auto md:pb-10">
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
      <main className="flex flex-1 flex-col items-center py-2 md:h-full md:overflow-y-auto md:pb-0">{children}</main>
    </div>
  );
}
