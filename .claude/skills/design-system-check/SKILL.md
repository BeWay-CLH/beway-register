---
name: design-system-check
description: Use whenever building, reviewing, or validating UI for BeWay — components, Tailwind config, globals.css, or any visual element — to check colors, typography, spacing, and logo usage against the official brand manual.
---

# BeWay Design System — Referencia y Checklist

Fuente de verdad: manual de marca (`design-tokens.md`). `tailwind.config.ts` y `globals.css` deben derivar de estos valores — nunca usar colores o tamaños "a ojo".

## Colores

| Token | Hex | Uso |
|---|---|---|
| `brand-dark` | `#0B132B` | Fondos oscuros, texto principal sobre fondo claro |
| `brand-navy` | `#1C2541` | Fondos secundarios, degradados junto a brand-dark |
| `brand-cyan` | `#00D4FF` | Acento: CTAs, links, elementos activos. Usar con moderación, nunca como color base |
| `brand-light` | `#F8FAFC` | Fondo principal en modo claro |
| `brand-gray` | `#64748B` | Texto secundario, iconos inactivos, bordes sutiles |

Gradiente de marca: diagonal `brand-dark → brand-cyan`, reutilizable para heroes, banners y botones destacados.

## Tipografía

- Títulos: **Space Grotesk**. Cuerpo: **Inter** (cargadas vía `next/font`).
- Escala: H1 32px/700 · H2 24px/600 · H3 20px/600 · Body 16px/400 · Small 14px/400.

## Bordes y elevación

- Radio de borde: `8px` (elementos pequeños), `16px` (cards).
- Sombras sutiles con tinte navy (`rgba(11,19,43,0.08)`), nunca negro puro.

## Identidad

Geométrica, tecnológica, con profundidad (efecto 3D/degradado) — no plana. El hexágono del logo no se deforma y el ángulo del degradado no cambia.

## Checklist de validación

- [ ] ¿Todos los colores se referencian como tokens de Tailwind (`bg-brand-*`, `text-brand-*`), sin hex sueltos en el código?
- [ ] ¿`brand-cyan` aparece como acento puntual (CTAs, links, estados activos) y no como color de fondo dominante?
- [ ] ¿Los títulos usan Space Grotesk y el cuerpo usa Inter?
- [ ] ¿Los tamaños de fuente corresponden a la escala definida (no valores arbitrarios)?
- [ ] ¿Los radios de borde son 8px o 16px según el tipo de elemento?
- [ ] ¿Las sombras usan el tinte navy en vez de negro puro?
- [ ] ¿El logo se usa sin deformar y con el degradado en el ángulo correcto?
