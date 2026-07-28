import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={inputId} className="font-body text-small font-medium text-brand-dark">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "rounded-brand border border-brand-gray/40 bg-brand-light px-4 py-3 font-body text-body text-brand-dark placeholder:text-brand-gray focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/40",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="font-body text-small text-brand-gray">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="font-body text-small text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
