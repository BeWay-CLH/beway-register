import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={selectId} className="font-body text-small font-medium text-brand-dark">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "rounded-brand border border-brand-gray/40 bg-brand-light px-4 py-3 font-body text-body text-brand-dark focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/40",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          defaultValue=""
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
        {error && (
          <p id={errorId} role="alert" className="font-body text-small text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
