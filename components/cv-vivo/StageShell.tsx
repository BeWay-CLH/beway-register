"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GlyphTile } from "@/components/ui/GlyphTile";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Button } from "@/components/ui/Button";
import { getStagePosition, getAdjacentSlugs } from "@/lib/cv-vivo/stages";

type StageShellProps = {
  slug: string;
  title: string;
  description: string;
  /** Tarjeta "Por qué lo pedimos" debajo del formulario — se omite si no se pasa. */
  whyText?: string;
  children: ReactNode;
};

// Molde compartido de las 10 etapas del wizard (BeWay Design System >
// ui_kits/platform/PreRegister.jsx): encabezado con degradado DENTRO de la
// tarjeta (no un <h1> suelto arriba), barra de navegación fija al pie
// (Anterior / Guardar y salir / Continuar) y tarjeta de contexto. No usa
// overflow-hidden en la tarjeta completa a propósito: eso rompería el
// sticky del pie cuando una etapa tiene muchas entradas y hay que
// desplazarse — en su lugar, el encabezado y el pie redondean sus propias
// esquinas para calzar con el radio de la tarjeta.
export function StageShell({ slug, title, description, whyText, children }: StageShellProps) {
  const router = useRouter();
  const { position, total } = getStagePosition(slug);
  const { prevSlug, nextSlug } = getAdjacentSlugs(slug);

  return (
    <div className="flex w-full max-w-[780px] flex-col gap-4">
      <Card padding="none" elevation="sm">
        <div className="rounded-t-lg border-b border-border-subtle bg-gradient-to-b from-surface-accent-subtle to-surface-card px-6 py-5">
          <span className="font-body text-eyebrow uppercase text-brand-cyan-600">
            Etapa {position} de {total}
          </span>
          <h1 className="mt-2.5 font-heading text-h1 text-text-heading">{title}</h1>
          <p className="mt-1.5 max-w-[560px] font-body text-body leading-relaxed text-text-muted">{description}</p>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">{children}</div>

        <div className="sticky bottom-0 z-10 flex items-center gap-3 rounded-b-lg border-t border-border-subtle bg-surface-card px-6 py-4 shadow-sticky-top">
          <Button variant="ghost" icon={ArrowLeft} disabled={!prevSlug} onClick={() => prevSlug && router.push(`/cv-vivo/${prevSlug}`)}>
            Anterior
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/cuenta")}>
              Guardar y salir
            </Button>
            <Button iconAfter={ArrowRight} onClick={() => router.push(nextSlug ? `/cv-vivo/${nextSlug}` : "/cuenta")}>
              Continuar
            </Button>
          </div>
        </div>
      </Card>

      {whyText && (
        <Card elevation="none" surface="sunken" className="flex gap-3">
          <GlyphTile icon={Sparkles} tone="navy" size={32} />
          <div>
            <FieldLabel>Por qué lo pedimos</FieldLabel>
            <p className="font-body text-small leading-relaxed text-text-body">{whyText}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
