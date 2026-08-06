import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

// No hay un Textarea en el BeWay Design System portado (solo Input de una
// línea) — extensión mínima con la misma superficie visual que Input, para
// campos largos como la bio (etapa 3). Sin label/error propios: se
// envuelve en <Field>.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid = false, className, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    return (
      <textarea
        ref={ref}
        id={id ?? generatedId}
        rows={rows}
        className={clsx(
          "w-full resize-y rounded-md border bg-surface-card px-3 py-2 font-body text-body text-text-body placeholder:text-text-muted",
          "transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-ring",
          "disabled:cursor-not-allowed disabled:bg-surface-sunken",
          invalid
            ? "border-status-danger focus-visible:border-status-danger"
            : "border-border-strong focus-visible:border-brand-cyan",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
