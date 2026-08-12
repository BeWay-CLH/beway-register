import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: ReactNode;
  selected?: boolean;
  onRemove?: () => void;
};

// BeWay Design System > components/core/Tag. Radio pill — la única pieza
// del sistema con ese radio (8px en todo lo demás); así se distingue
// "contenido" de "estado/selección". Seleccionado = brand-dark, nunca
// cian (el cian es solo para la acción primaria).
export function Tag({ children, selected = false, onRemove, className, ...props }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-body text-small",
        selected ? "bg-brand-dark text-text-on-inverse" : "border border-border-strong bg-surface-card text-text-body",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar"
          className="rounded-full p-0.5 transition-colors duration-fast ease-standard hover:bg-black/10"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
