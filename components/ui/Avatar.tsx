import { clsx } from "clsx";

type AvatarProps = {
  name: string;
  size?: number;
  ring?: boolean;
  className?: string;
};

// BeWay Design System > ui_kits/platform/AppChrome.jsx > Avatar. Sin foto
// real todavía (no hay Storage conectado) — siempre iniciales sobre el
// degradado de marca.
export function Avatar({ name, size = 40, ring = false, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={clsx(
        "grid shrink-0 place-items-center overflow-hidden rounded-pill bg-brand-gradient-soft font-heading font-bold text-white",
        ring && "shadow-[0_0_0_4px_var(--surface-card),0_0_0_5px_var(--border-subtle)]",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
