import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Loader2, type LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gradient";
type ButtonSize = "sm" | "md" | "lg";

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Lucide icon rendered before the label. */
  icon?: LucideIcon;
  /** Lucide icon rendered after the label — usually ArrowRight. */
  iconAfter?: LucideIcon;
  fullWidth?: boolean;
  /** Recolours outline/ghost for dark navy surfaces. */
  onInverse?: boolean;
  /** Ícono girando en vez de `icon`, y deshabilita el botón — para
   * acciones que disparan una Server Action (guardar, eliminar). La
   * latencia real hacia Supabase/Upstash no baja, pero un indicador
   * visible de inmediato hace que la espera se sienta más corta. */
  loading?: boolean;
};

type ButtonAsButtonProps = ButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** Pasar `href` renderiza un `next/link` con el mismo estilo — para CTAs
 * de navegación pura (landing, marketing) que no disparan una acción. */
type ButtonAsLinkProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-control-sm px-3 text-small gap-2",
  md: "h-control-md px-4 text-body gap-2",
  lg: "h-control-lg px-5 text-body gap-3",
};

const iconSizes: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

// primary = cian (una por vista); secondary = navy; outline/ghost =
// discretos; gradient = solo hero. BeWay Design System > components/core/Button.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-action-primary text-text-on-accent hover:bg-brand-cyan-300 hover:shadow-glow",
  secondary: "bg-action-secondary text-text-on-inverse hover:bg-brand-navy",
  outline: "bg-transparent text-text-body border border-border-strong hover:bg-surface-sunken",
  ghost: "bg-transparent text-text-body hover:bg-surface-sunken",
  gradient: "bg-brand-gradient-soft text-white hover:shadow-glow",
};

const onInverseOverrides: Partial<Record<ButtonVariant, string>> = {
  outline: "text-text-on-inverse border-border-inverse hover:bg-white/10",
  ghost: "text-text-on-inverse hover:bg-white/10",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconAfter: IconAfter,
  fullWidth = false,
  onInverse = false,
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const iconSize = iconSizes[size];
  const classes = clsx(
    "items-center justify-center rounded-md font-body font-semibold tracking-tight",
    "transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-ring",
    "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
    fullWidth ? "flex w-full" : "inline-flex",
    sizeClasses[size],
    variantClasses[variant],
    onInverse && onInverseOverrides[variant],
    className,
  );
  const content = (
    <>
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : Icon && <Icon size={iconSize} />}
      {children}
      {!loading && IconAfter && <IconAfter size={iconSize} />}
    </>
  );

  // Discriminar con `typeof` en vez de `"href" in props`: TS no conserva
  // bien la unión discriminada de ButtonProps tras el rest-spread de arriba
  // cuando la única diferencia entre ramas es la opcionalidad de `href`
  // (string vs. undefined), así que se afirma el tipo de cada rama después
  // de comprobarlo en runtime.
  if (typeof (props as { href?: string }).href === "string") {
    const { href, ...anchorProps } = props as ButtonAsLinkProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButtonProps;
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
