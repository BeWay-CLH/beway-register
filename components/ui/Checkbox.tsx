import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  /** Second muted line under the label. */
  description?: string;
  error?: string;
};

// BeWay Design System > components/forms/Checkbox. Input real (sr-only)
// + <label htmlFor> para accesibilidad y compatibilidad con
// react-hook-form; el visual se pinta vía peer-checked.
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, disabled, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label
          htmlFor={checkboxId}
          className={clsx(
            "inline-flex gap-3",
            description ? "items-start" : "items-center",
            disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
          )}
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className={clsx("peer sr-only", className)}
            aria-invalid={error ? true : undefined}
            {...props}
          />
          <span
            className={clsx(
              "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border",
              "transition-colors duration-fast ease-standard peer-focus-visible:shadow-focus-ring",
              "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
              error ? "border-status-danger" : "border-border-strong peer-checked:border-brand-cyan",
              "peer-checked:bg-brand-cyan",
            )}
          >
            <Check size={13} strokeWidth={3} className="text-brand-dark" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-body text-small text-text-body">{label}</span>
            {description && <span className="font-body text-small text-text-muted">{description}</span>}
          </span>
        </label>
        {error && (
          <p role="alert" className="font-body text-small text-status-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
