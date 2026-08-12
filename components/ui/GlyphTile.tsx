import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

type GlyphTileTone = "accent" | "navy";

type GlyphTileProps = {
  icon: LucideIcon;
  size?: number;
  tone?: GlyphTileTone;
  className?: string;
};

const toneClasses: Record<GlyphTileTone, string> = {
  accent: "bg-surface-accent-subtle text-brand-cyan-600",
  navy: "bg-surface-inverse text-brand-cyan",
};

// BeWay Design System > ui_kits/platform/AppChrome.jsx > GlyphTile —
// marcador de objeto (certificación, proyecto, recomendación IA). Solo se
// portan los tonos que este repo llega a usar; el DS también define
// "violet"/"mint" para variedad de categorías que no tenemos modeladas.
export function GlyphTile({ icon: Icon, size = 34, tone = "accent", className }: GlyphTileProps) {
  return (
    <span
      className={clsx("grid shrink-0 place-items-center rounded-md", toneClasses[tone], className)}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={2} />
    </span>
  );
}
