import type { ReactNode } from "react";

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
};

// Envoltorio de label/hint/error compartido por Input y Select — BeWay
// Design System > components/forms/Field.
export function Field({ label, hint, error, required = false, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 text-left">
      {label && (
        <label htmlFor={htmlFor} className="flex gap-1 font-body text-small font-semibold text-text-body">
          {label}
          {required && <span className="text-brand-cyan-600">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="font-body text-small text-status-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="font-body text-small text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
