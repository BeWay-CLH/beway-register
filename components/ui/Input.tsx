import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Lucide icon shown inside the left edge. */
  icon?: LucideIcon;
  invalid?: boolean;
};

// Campo de texto de una línea — BeWay Design System > components/forms/Input.
// Sin label/error propios: se envuelve en <Field> (ver components/ui/Field).
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, invalid = false, className, id, ...props }, ref) => {
    const generatedId = useId();
    return (
      <div className="relative w-full">
        {Icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          id={id ?? generatedId}
          className={clsx(
            "h-control-md w-full rounded-md border bg-surface-card px-3 font-body text-body text-text-body placeholder:text-text-muted",
            "transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-ring",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken",
            Icon && "pl-9",
            invalid
              ? "border-status-danger focus-visible:border-status-danger"
              : "border-border-strong focus-visible:border-brand-cyan",
            className,
          )}
          aria-invalid={invalid || undefined}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
