import type { ReactNode } from "react";
import { Lock } from "lucide-react";

type ComingSoonProps = {
  children: ReactNode;
  message?: string;
};

// Envuelve una sección que sí existe en la plataforma final (Video-Pitch,
// Recomendación IA, Actividad) pero está fuera de alcance del pre-registro
// (CLAUDE.md > Fuera de alcance). Muestra el esqueleto real por debajo,
// atenuado, para que el usuario sepa qué información habrá ahí — con un
// cartel encima dejando claro que todavía no está disponible.
export function ComingSoon({ children, message = "Disponible en la versión final" }: ComingSoonProps) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none opacity-40 blur-[1.5px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-lg">
        <span className="inline-flex items-center gap-2 rounded-pill border border-border-strong bg-surface-card px-4 py-2 font-body text-small font-semibold text-text-muted shadow-md">
          <Lock size={14} />
          {message}
        </span>
      </div>
    </div>
  );
}
