import type { ReactNode } from "react";
import { clsx } from "clsx";

type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
  htmlFor?: string;
  children: ReactNode;
};

// col-span-N como literales (no `col-span-${n}`) para que Tailwind los
// detecte en build — una interpolación dinámica no genera la clase.
const spanClasses: Record<NonNullable<FormFieldProps["span"]>, string> = {
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  12: "sm:col-span-12",
};

// Campo de un FieldGroup (BeWay Design System > ui_kits/platform/
// PreRegister.jsx > FormField): etiqueta micro-caps + control + hint/error,
// posicionado en la grilla de 12 columnas. Siempre a ancho completo en
// mobile — el span reducido solo aplica desde `sm`.
export function FormField({ label, required, hint, error, span = 6, htmlFor, children }: FormFieldProps) {
  return (
    <div className={clsx("col-span-12 min-w-0", spanClasses[span])}>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-1 font-body text-eyebrow uppercase text-text-muted"
      >
        {label}
        {required && <span className="text-brand-cyan-600">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 font-body text-small text-status-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 font-body text-[12px] text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
