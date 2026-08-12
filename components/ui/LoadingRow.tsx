import { Loader2 } from "lucide-react";

// Fila de reemplazo mientras se actualiza una lista de entradas (educación,
// experiencia, etc.) tras guardar o eliminar — cubre el hueco entre que el
// formulario se cierra y router.refresh() entrega los datos reales.
export function LoadingRow({ label = "Actualizando…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed border-border-strong px-4 py-3 text-text-muted">
      <Loader2 className="animate-spin" size={16} />
      <span className="font-body text-small">{label}</span>
    </div>
  );
}
