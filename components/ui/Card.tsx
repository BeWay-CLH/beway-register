import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type CardSurface = "light" | "sunken" | "inverse" | "gradient";
type CardElevation = "none" | "sm" | "md" | "lg";
type CardPadding = "none" | "md";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  surface?: CardSurface;
  elevation?: CardElevation;
  padding?: CardPadding;
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

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  md: "p-6",
};

// Contenedor de contenido al radio de 16px — BeWay Design System > components/core/Card.
// padding="none" es para paneles con media a sangre (ej. video pitch), donde
// el padding se aplica solo al bloque de texto debajo, no a la tarjeta entera.
export function Card({ surface = "light", elevation = "sm", padding = "md", className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg",
        paddingClasses[padding],
        surfaceClasses[surface],
        elevationClasses[elevation],
        className,
      )}
      {...props}
    />
  );
}
