import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
};

// Desplegable — BeWay Design System > components/forms/Select. Sin
// label/error propios: se envuelve en <Field> (ver components/ui/Field).
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, invalid = false, className, id, ...props }, ref) => {
    const generatedId = useId();
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          id={id ?? generatedId}
          defaultValue=""
          className={clsx(
            "h-control-md w-full appearance-none rounded-md border bg-surface-card px-3 pr-9 font-body text-body text-text-body",
            "transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-ring",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken",
            invalid
              ? "border-status-danger focus-visible:border-status-danger"
              : "border-border-strong focus-visible:border-brand-cyan",
            className,
          )}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <ChevronDown size={16} />
        </span>
      </div>
    );
  },
);

Select.displayName = "Select";
