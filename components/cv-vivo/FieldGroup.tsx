import type { ReactNode } from "react";

type FieldGroupProps = {
  title: string;
  caption?: string;
  children: ReactNode;
};

// Grupo de campos con título (BeWay Design System > ui_kits/platform/
// PreRegister.jsx > FieldGroup): reemplaza la lista de campos apilados de
// a uno por una grilla de 12 columnas agrupada por tema — la "priorización
// de campos" que pidió el usuario en vez de un formulario plano.
export function FieldGroup({ title, caption, children }: FieldGroupProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="font-heading text-[15px] font-bold uppercase tracking-caps text-text-heading">{title}</span>
        <span className="h-px flex-1 bg-border-subtle" />
        {caption && <span className="font-body text-[12px] text-text-muted">{caption}</span>}
      </div>
      <div className="grid grid-cols-12 gap-4">{children}</div>
    </section>
  );
}
