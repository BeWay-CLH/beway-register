import Image from "next/image";

const SOURCE = { width: 200, height: 165 };

type LogoProps = {
  height?: number;
  className?: string;
};

// Único lockup traído del BeWay Design System por ahora (fondo oscuro o
// degradado — ver ui_kits/website/Join.jsx). El logo real no se redibuja
// ni se re-angula su degradado (CLAUDE.md > Diseño). Otras variantes
// (primary, mono, mark) se agregan cuando haga falta un fondo claro.
export function Logo({ height = 40, className }: LogoProps) {
  const width = Math.round((height * SOURCE.width) / SOURCE.height);
  return (
    <Image
      src="/brand/logo-stacked-negative.png"
      alt="BeWay"
      width={width}
      height={height}
      className={className}
    />
  );
}
