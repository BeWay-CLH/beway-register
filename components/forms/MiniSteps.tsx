import { Fragment } from "react";
import { clsx } from "clsx";

type MiniStepsProps = {
  current?: 0 | 1;
};

const STEPS = ["Crea tu cuenta", "Completa tu CV Vivo"];
const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

// BeWay Design System > ui_kits/platform/Register.jsx > MiniSteps:
// orientación de 2 pasos sobre el registro (crear cuenta → CV Vivo) — solo
// para /registro, no aplica a /iniciar-sesion (un usuario que inicia
// sesión ya tiene cuenta, no está "creándola").
export function MiniSteps({ current = 0 }: MiniStepsProps) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((label, index) => (
        <Fragment key={label}>
          <span className="flex items-center gap-2">
            <span
              className={clsx(
                "grid h-5 w-5 shrink-0 place-items-center font-heading text-[11px] font-bold",
                index === current ? "bg-brand-gradient-soft text-white" : "bg-brand-gray-200 text-text-muted",
              )}
              style={{ clipPath: HEX_CLIP }}
            >
              {index + 1}
            </span>
            {/* Las etiquetas se ocultan en mobile — con las dos juntas más
                la línea conectora no caben en una pantalla angosta; los
                hexágonos + la línea ya comunican el progreso por sí solos. */}
            <span
              className={clsx(
                "hidden whitespace-nowrap font-body text-[12px] font-semibold uppercase tracking-caps sm:inline",
                index === current ? "text-text-heading" : "text-text-muted",
              )}
            >
              {label}
            </span>
          </span>
          {index === 0 && <span className="h-px flex-1 bg-border-subtle" />}
        </Fragment>
      ))}
    </div>
  );
}
