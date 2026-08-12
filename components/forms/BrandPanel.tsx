import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { SectionLabel } from "@/components/ui/SectionLabel";

type BrandPanelProps = {
  eyebrow: string;
  title: string;
  /** Contenido de soporte bajo el titular — ej. lista de beneficios. */
  children?: ReactNode;
  showStats?: boolean;
};

const STATS: [string, string][] = [
  ["+120", "empresas del ecosistema"],
  ["10 min", "para tu CV Vivo"],
  ["0 €", "para el talento"],
];

// BeWay Design System > ui_kits/platform/Register.jsx > BrandPanel. Panel
// izquierdo compartido por Registro e Inicio de sesión: degradado de
// marca, logo negativo, marca de agua del hexágono y prueba social — nunca
// un wordmark plano.
export function BrandPanel({ eyebrow, title, children, showStats = true }: BrandPanelProps) {
  return (
    <aside className="relative flex flex-col gap-8 overflow-hidden bg-brand-gradient px-6 py-12 text-text-on-inverse md:min-h-screen md:px-16 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-no-repeat opacity-[0.07]"
        style={{
          backgroundImage: "url(/brand/logo-icon-transparent.png)",
          backgroundPosition: "120% 88%",
          backgroundSize: "420px",
        }}
      />
      <div className="relative mx-auto md:mx-0">
        <Logo height={40} />
      </div>
      <div className="relative mx-auto flex max-w-[460px] flex-col gap-5 text-center md:mx-0 md:my-auto md:text-left">
        <div>
          <SectionLabel onInverse align="center" className="mx-auto md:mx-0 md:items-start">
            {eyebrow}
          </SectionLabel>
          <h1 className="mt-4 font-heading text-display text-white">{title}</h1>
        </div>
        {children}
        {showStats && (
          <div className="flex justify-center gap-6 border-t border-border-inverse pt-4 md:justify-start">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <p className="font-heading text-[22px] font-bold text-brand-cyan">{value}</p>
                <p className="max-w-[130px] font-body text-[12px] leading-tight text-text-on-inverse-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
