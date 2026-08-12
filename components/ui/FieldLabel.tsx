import type { ReactNode } from "react";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

type FieldLabelProps = {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

// BeWay Design System > ui_kits/platform/AppChrome.jsx > FieldLabel —
// micro-caps encima de cada campo/métrica de las pantallas de plataforma.
// Distinto de components/ui/Field: ese envuelve un control de formulario
// completo (label + hint + error); este es solo la etiqueta suelta, para
// usarla junto a texto de solo lectura.
export function FieldLabel({ children, icon: Icon, className }: FieldLabelProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 font-body text-eyebrow uppercase text-text-muted",
        className,
      )}
    >
      {Icon && <Icon size={13} strokeWidth={2} />}
      {children}
    </div>
  );
}
