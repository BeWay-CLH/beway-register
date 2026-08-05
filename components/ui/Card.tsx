import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type CardSurface = "light" | "sunken" | "inverse" | "gradient";
type CardElevation = "none" | "sm" | "md" | "lg";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  surface?: CardSurface;
  elevation?: CardElevation;
};

const surfaceClasses: Record<CardSurface, string> = {
  light: "bg-surface-card text-text-body border border-border-subtle",
  sunken: "bg-surface-sunken text-text-body border border-border-subtle",
  inverse: "bg-surface-inverse text-text-on-inverse border border-border-inverse",
  gradient: "bg-brand-gradient text-text-on-inverse border border-transparent",
};

const elevationClasses: Record<CardElevation, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

// Contenedor de contenido al radio de 16px — BeWay Design System > components/core/Card.
export function Card({ surface = "light", elevation = "sm", className, ...props }: CardProps) {
  return (
    <div
      className={clsx("rounded-lg p-6", surfaceClasses[surface], elevationClasses[elevation], className)}
      {...props}
    />
  );
}
