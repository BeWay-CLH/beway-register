# Manual de Marca — BeWay
> Ecosistema de Talento, Innovación y Oportunidades

Este documento es la fuente de verdad de estilo para el proyecto. Cualquier componente de UI debe usar estos valores en vez de colores o tamaños "a ojo".

## Concepto de marca
El logo combina 4 elementos: la inicial **B** de BeWay, un **hexágono** (conexión de ecosistema), una flecha **>** (dirección hacia el futuro) y un **cubo 3D** (progreso). Esto se traduce en una identidad **geométrica, tecnológica y con profundidad (efecto 3D/degradado)**, no plana.

Pilares de mensaje (usados en footer/secciones "sobre nosotros"):
- Conectamos talento
- Impulsamos la innovación
- Generamos oportunidades
- Construimos el futuro

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `brand-dark` | `#0B132B` | Azul marino casi negro. Fondos oscuros (headers, cards oscuras), texto principal sobre fondo claro |
| `brand-navy` | `#1C2541` | Azul marino medio. Fondos secundarios, degradados junto a brand-dark |
| `brand-cyan` | `#00D4FF` | Cian brillante. Color de acento: CTAs, links, elementos activos, parte del logo. Es el color "vivo" de la marca — usar con moderación, como acento, no como base |
| `brand-light` | `#F8FAFC` | Casi blanco. Fondo principal en modo claro |
| `brand-gray` | `#64748B` | Gris azulado. Texto secundario, iconos inactivos, bordes sutiles |

**Nota sobre degradados:** el logo y las piezas de marca (tarjetas, banderolas) usan un degradado diagonal de 135°, `brand-dark` → `brand-navy` (parada al 45%) → `brand-cyan`. El ángulo y las paradas no se cambian. Token: `--brand-gradient` (`bg-brand-gradient` en Tailwind).

### Tonos derivados y tokens semánticos

Importados del BeWay Design System (claude.ai/design) — no son colores de marca nuevos, son pasos intermedios y roles semánticos construidos sobre los 5 valores de arriba. Viven en `app/globals.css` (`:root`) y se exponen como utilidades en `tailwind.config.ts`.

| Grupo | Tokens | Uso |
|---|---|---|
| Pasos derivados | `brand-navy-600/400`, `brand-cyan-600/300/100`, `brand-gray-400/200/100` | Hover, hairlines, tintes — nunca en piezas de marca (logo, gradiente) |
| Superficies | `surface-page`, `surface-card`, `surface-sunken`, `surface-inverse`, `surface-inverse-alt`, `surface-accent-subtle` | Fondos por contexto |
| Texto | `text-body`, `text-heading`, `text-muted`, `text-accent`, `text-on-inverse`, `text-on-inverse-muted`, `text-on-accent` | Cian es un color claro — texto sobre cian siempre `text-on-accent` (= brand-dark), nunca blanco |
| Bordes | `border-subtle`, `border-strong`, `border-inverse`, `border-accent` | — |
| Interactivo | `action-primary(-hover/-active)`, `action-secondary(-hover)`, `focus-ring`, `link(-hover)`, `link-on-inverse` | Botones, links, focus |
| Estado | `status-success`, `status-warning`, `status-danger`, `status-info` | No vienen del manual — derivados para no competir con el cian |

**Foco:** anillo de 3px `rgba(0,212,255,.40)` (`--ring-focus` / `shadow-focus-ring`) — el cian es el color de foco en toda la app, incluso sobre fondos oscuros.

## Tipografía

### Títulos
- **Space Grotesk** — geométrica con un toque más técnico/monoespaciado

### Cuerpo y otros textos
- **Inter** - Para el cuerpo de la página

Escala tipográfica sugerida:
| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| Logo/Display | 40px+ | 800 | Solo logotipo/hero |
| H1 | 32px | 700 | Títulos de página |
| H2 | 24px | 600 | Títulos de sección |
| H3 | 20px | 600 | Subtítulos |
| Body | 16px | 400 | Texto general |
| Small | 14px | 400 | Texto secundario, captions |

## Logotipo — reglas de uso
- **Versión principal**: icono hexagonal con degradado navy→cyan + wordmark "BEWAY" en `brand-dark`, subtítulo con "INNOVACIÓN" resaltado en `brand-cyan`.
- **Versión monocroma**: icono y texto en blanco, para fondos oscuros/fotográficos donde el color compite.
- **Versión negativa**: icono con degradado navy→cyan conservado, texto en blanco — para fondos oscuros donde sí se quiere mantener el color de marca.
- No deformar el hexágono, no cambiar el ángulo del degradado, mantener el subtítulo en dos líneas cuando el espacio lo permita.

## Bordes, espaciado y elevación
- Radio de borde: `--radius-sm` 4px (detalles), `--radius-md` 8px (botones, inputs, badges), `--radius-lg` 16px (cards), `--radius-xl` 24px (paneles hero), `--radius-pill` (solo en Tags/estado — la diferencia pill-vs-8px es cómo BeWay distingue "contenido" de "estado")
- Alturas de control: `--control-height-sm` 32px, `-md` 40px, `-lg` 48px (`h-control-sm/md/lg` en Tailwind)
- Sombras: navy-tinted, nunca negro puro — `--shadow-xs/sm/md/lg` (`rgba(11,19,43,.06→.14)`). Brillo cian (`--shadow-glow`) solo en hover de botones primary/gradient.
- Movimiento: preciso y corto, sin rebote — `--duration-fast` 120ms (feedback de controles), `--duration-base` 200ms, `--duration-slow` 360ms (entradas); `--ease-standard` para cambios de estado, `--ease-out` para reveals.

## Iconografía
Sistema: **[Lucide](https://lucide.dev)** (`lucide-react`), outline-only, 2px de trazo — la mejor aproximación disponible a los íconos geométricos del manual de marca (hexágono, flecha `>`, cubo). `currentColor` siempre — el color lo pone el contenedor, nunca el glyph. Nunca mezclar con otro set, nunca emoji, nunca ícono relleno.

## Componentes reales
El BeWay Design System (proyecto "BeWay Design System" en claude.ai/design) tiene ~20 componentes de referencia (Button, Card, Field, Input, Select, Checkbox, Switch, Dialog, Toast, Tabs, etc.) con su especificación visual completa. `components/ui/` de este repo los porta a React + Tailwind + los tokens de arriba, adaptados a las necesidades reales del formulario (react-hook-form, RLS, etc.) en vez de copiar el HTML/inline-styles del prototipo.

---
*Este archivo debe mantenerse actualizado a mano. `tailwind.config.ts` y `app/globals.css` derivan de estos valores — si cambia uno, debe cambiar el otro.*
