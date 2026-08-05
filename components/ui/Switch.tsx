import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

// Toggle — BeWay Design System > components/forms/Switch. Input real
// (accesible, compatible con react-hook-form) con el track/thumb pintado
// vía peer-* en vez del estado de React que usa el componente original.
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, disabled, className, id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
      <label
        htmlFor={switchId}
        className={clsx("inline-flex items-center gap-3", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer")}
      >
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className={clsx("peer sr-only", className)}
          {...props}
        />
        <span
          className={clsx(
            "flex h-[22px] w-10 shrink-0 items-center rounded-pill bg-brand-gray-200 p-0.5",
            "transition-colors duration-base ease-standard peer-checked:bg-brand-cyan peer-focus-visible:shadow-focus-ring",
            "[&>span]:transition-transform [&>span]:duration-base [&>span]:ease-standard peer-checked:[&>span]:translate-x-[18px]",
          )}
        >
          <span className="h-[18px] w-[18px] rounded-pill bg-white shadow-xs" />
        </span>
        {label && <span className="font-body text-small text-text-body">{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";
