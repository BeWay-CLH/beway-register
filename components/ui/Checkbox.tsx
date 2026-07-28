import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={clsx(
              "mt-0.5 h-5 w-5 shrink-0 rounded border-brand-gray/40 text-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/40",
              error && "border-red-500",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <label htmlFor={checkboxId} className="font-body text-small text-brand-dark">
            {label}
          </label>
        </div>
        {error && (
          <p id={errorId} role="alert" className="font-body text-small text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
