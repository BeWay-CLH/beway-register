"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";

type PasswordFieldProps = {
  id?: string;
  value: string;
  invalid?: boolean;
  /** Barra de fuerza + etiqueta — solo tiene sentido al crear una contraseña nueva. */
  showStrength?: boolean;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
};

const STRENGTH_LABELS = ["Muy corta", "Débil", "Aceptable", "Fuerte"];

function computeStrength(value: string) {
  if (!value) return 0;
  const hasNonAlpha = /[^a-zA-Z]/.test(value);
  return Math.min(3, Math.floor(value.length / 4) + (hasNonAlpha ? 1 : 0));
}

// BeWay Design System > ui_kits/platform/Register.jsx > PasswordField:
// mostrar/ocultar en vez de un segundo campo "confirmar contraseña" — el
// usuario revisa lo que escribió directamente. La barra de fuerza es una
// heurística simple (largo + variedad de caracteres), no un análisis real
// de fuerza de contraseña.
export function PasswordField({
  id,
  value,
  invalid,
  showStrength = false,
  registration,
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const score = computeStrength(value);

  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          invalid={invalid}
          className="pr-11"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-text-body"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={clsx(
                  "h-1 flex-1 rounded-pill transition-colors duration-base ease-standard",
                  value && score > i ? "bg-brand-cyan" : "bg-surface-sunken",
                )}
              />
            ))}
          </div>
          <span className="min-w-[74px] text-right font-body text-[12px] text-text-muted">
            {value ? STRENGTH_LABELS[score] : "Mínimo 8"}
          </span>
        </div>
      )}
    </div>
  );
}
