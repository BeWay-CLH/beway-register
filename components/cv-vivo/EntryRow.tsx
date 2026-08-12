import type { LucideIcon } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { GlyphTile } from "@/components/ui/GlyphTile";

type EntryRowProps = {
  icon: LucideIcon;
  title: string;
  meta: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

// Entrada ya guardada (BeWay Design System > ui_kits/platform/
// PreRegister.jsx > EntryRow): fila compacta con glifo + título + meta +
// acciones. Reemplaza las tarjetas de EntryCard que usaba cada formulario
// de etapa repetible (educación, experiencia, proyectos, certificaciones,
// evidencias).
export function EntryRow({ icon, title, meta, onEdit, onDelete, disabled }: EntryRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border-subtle bg-surface-card p-3">
      <GlyphTile icon={icon} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-[14px] font-semibold text-text-heading">{title}</p>
        <p className="truncate font-body text-[12px] text-text-muted">{meta}</p>
      </div>
      <div className="ml-auto flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          aria-label="Editar"
          className="rounded-md p-2 text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-text-body disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label="Eliminar"
          className="rounded-md p-2 text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-status-danger disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
