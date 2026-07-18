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

**Nota sobre degradados:** el logo y las piezas de marca (tarjetas, banderolas) usan un degradado diagonal de `brand-dark` → `brand-cyan`. Vale la pena tener un token de gradiente reutilizable para heroes, banners o botones destacados.

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
- Radio de borde: `8px` (elementos pequeños), `16px` (cards)
- Sombras: sutiles, con tinte navy en vez de negro puro (ej. `rgba(11,19,43,0.08)`)

---
*Este archivo debe mantenerse actualizado a mano. `tailwind.config.ts` y `globals.css` derivan de estos valores — si cambia uno, debe cambiar el otro.*
