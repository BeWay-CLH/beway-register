import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type SectionLabelProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  onInverse?: boolean;
  align?: "left" | "center";
};

// El dispositivo de sección del manual de marca: caps con tracking ancho
// sobre una regla cian corta — BeWay Design System > components/core/SectionLabel.
export function SectionLabel({
  children,
  onInverse = false,
  align = "left",
  className,
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={clsx("inline-flex flex-col gap-2", align === "center" ? "items-center" : "items-start", className)}
      {...props}
    >
      <span
        className={clsx(
          "font-body text-eyebrow uppercase",
          onInverse ? "text-white" : "text-text-heading",
        )}
      >
        {children}
      </span>
      <span className="h-[3px] w-14 rounded-full bg-brand-cyan" />
    </div>
  );
}
