# CLAUDE.md — BeWay Pre-Registro

Formulario de pre-registro para BeWay (plataforma de "CV Vivo" que conecta estudiantes con empresas). Captura leads antes del lanzamiento y permite, opcionalmente, llenar el CV Vivo por etapas.

## Stack

- **Next.js** (App Router, TypeScript) — frontend + Server Actions.
- **Supabase** (Postgres + Auth + RLS) — datos y autenticación. **Proyecto en región UE (Frankfurt)**, no EE.UU. — requisito de GDPR/LOPDGDD.
- **Vercel** — despliegue (repo de GitHub conectado, previews por PR). Fijar región de funciones a Europa cuando sea configurable.
- **react-hook-form + zod** — validación (un solo schema, cliente y servidor).
- **Cloudflare Turnstile** — anti-bot en el registro. Revisar DPA/subencargados antes de lanzar en la UE.
- **Upstash Redis** — rate limiting. **Instancia en región UE.**
- **Resend** — correos transaccionales (opcional en esta fase). Revisar DPA/subencargados antes de lanzar en la UE.

## Entornos y flujo de desarrollo

- **Local (día a día)**: Supabase CLI (`supabase init` / `supabase start`) — Postgres + Auth + Storage en Docker. Correos de Auth interceptados localmente (Inbucket/Mailpit, `localhost:54324`), sin salir a internet. Toda la iteración de esquema y de features ocurre aquí primero.
- **Migraciones como fuente de verdad**: cambios de esquema siempre vía `supabase migration new <nombre>` en `supabase/migrations/`, nunca editados a mano en un dashboard. `supabase db push` sincroniza al proyecto cloud vinculado (`supabase link`).
- **Dos proyectos cloud, ambos en región UE (Frankfurt)**: uno para preview/staging (Preview Deployments de Vercel apuntan aquí) y uno separado para producción, creado cerca del lanzamiento con RLS ya revisado.
- **Variables de entorno separadas por entorno**: `.env.local` → instancia local; Vercel (preview/producción) → proyecto cloud correspondiente. La service role key nunca sale del servidor en ningún entorno.
- No apuntar nunca un entorno de desarrollo/pruebas automatizadas a producción.

## Principios de código

- **Server Components por defecto.** Usar `"use client"` solo donde haya interactividad (inputs, estado del wizard).
- **Server Actions** para mutaciones; nada de rutas API salvo webhooks o integraciones externas.
- **Zod como fuente de verdad de validación.** Definir el schema una vez y reutilizarlo en cliente y en la Server Action. Nunca confiar solo en validación de cliente.
- **`next/image`** siempre para imágenes; SVG para el logotipo.
- **TypeScript estricto.** Tipos generados de Supabase (`supabase gen types`), no tipos escritos a mano para las tablas.
- **Accesibilidad y mobile-first.** Los usuarios completan esto desde el celular.
- Componentes pequeños y con una sola responsabilidad. Lógica de datos fuera de los componentes de UI.

## Estructura de carpetas

```
app/
  (marketing)/            # landing pública (estática/SSG)
  registro/               # Paso 1: creación de cuenta
  cv-vivo/                # Paso 2: wizard por etapas (rutas por etapa)
  cuenta/                 # gestión de perfil: exportar datos, eliminar cuenta (GDPR)
  layout.tsx
components/
  ui/                     # primitivos reutilizables (Button, Input, Select, Tag...)
  forms/                  # campos y bloques de formulario
  cv-vivo/                # componentes específicos del wizard
lib/
  supabase/               # clients (server, client, middleware) + tipos generados
  validations/            # schemas zod por etapa
  rate-limit.ts           # helper de Upstash
  catalogs.ts             # fetch de tablas de catálogo (lookup)
supabase/
  migrations/             # SQL de esquema y seeds de catálogos
```

## Modelo de datos

Relaciones convencionales. Un usuario tiene un perfil (1:1) y varias entradas repetibles (1:N).

**Núcleo**
- `profiles` — 1:1 con `auth.users`. Datos de la cuenta (Paso 1) + información personal y presentación (etapas 2-3). Incluye `video_pitch_url` (reservado, sin UI todavía).
- `education` — formación (etapa 4). 1:N (una principal en pre-registro).
- `experiences` — experiencia (etapa 5). **1:N, máx. 3.**
- `projects` — proyectos y actividades (etapa 6). **1:N, máx. 3.**
- `certifications` — formación complementaria (etapa 8). **1:N, máx. 3.**
- `skills` / `languages` — habilidades e idiomas (etapa 7). 1:N.
- `evidences` — enlaces externos (etapa 10). 1:N.
- `preferences` — preferencias profesionales (etapa 9). 1:1.
- `privacy_settings` — visibilidad y contacto (etapa 11). 1:1.

Los límites de 3 se validan en zod **y** con un trigger/constraint en Postgres. El modelo 1:N deja la puerta abierta a subir el límite en la plataforma final sin migración.

**Catálogos (lookup) — fuente única de verdad**
Las opciones de todo dropdown viven en tablas de catálogo con seed en migraciones, no hardcodeadas en el frontend. Los campos que las referencian usan FK.
- `countries` (nacionalidad / país)
- `universities`
- `study_fields` (carrera / área)
- `academic_status` (situación académica)
- `languages_catalog` + `proficiency_levels`
- `referral_sources` ("¿cómo te enteraste?")
- `opportunity_types`, `work_modalities`, `sectors`, `availability_options`
- `experience_types`, `project_types`, `certification_types`

Se leen en Server Components y se cachean. Añadir opciones = insertar fila, no tocar código.

## Seguridad

- **RLS obligatorio** en todas las tablas: cada usuario solo lee/escribe sus propias filas. Catálogos: lectura pública, escritura solo service role.
- **Rate limiting** (Upstash) en registro y en cada guardado de etapa: limitar por IP y por usuario para frenar DoS/abuso.
- **Turnstile** validado en servidor antes de crear la cuenta.
- **Validación en servidor** siempre (zod en la Server Action), nunca confiar en el cliente.
- **Consentimientos separados**: aceptación de términos (obligatorio) distinto de consentimiento de marketing (opcional) — columnas separadas.
- Secrets solo en variables de entorno. Nunca exponer la service role key al cliente.
- No poner datos personales en query params ni en URLs.

## Privacidad y GDPR/LOPDGDD (lanzamiento en España/UE)

Checklist técnico completo en el skill `gdpr-check`. Esto **no sustituye revisión legal** — pendiente validación de un abogado especializado en protección de datos, incluyendo la redacción final de Política de Privacidad y Términos y Condiciones. Ver `docs/pending-decisions.md` para el estado de estos pendientes.

- Datos alojados en región UE (ver Stack). Revisar DPA/subencargados de cualquier proveedor de terceros.
- El usuario debe poder **exportar sus datos** y **eliminar su cuenta** (borrado real o anonimización) desde su perfil — incluir en el alcance del wizard, no solo en el backend.
- **Retención de leads sin completar**: pendiente de definir el plazo con negocio/legal; no conservar indefinidamente por defecto.
- Preferir analítica cookieless (evita banner de cookies bajo LSSI-CE).
- Edad mínima de consentimiento en España: 14 años — evaluar si aplica gate de edad.

## Diseño — tokens de marca

Los valores viven en `tailwind.config.ts` + `globals.css`, derivados del manual de marca. **No usar colores/tamaños "a ojo".**

**Colores**
| Token | Hex | Uso |
|---|---|---|
| `brand-dark` | `#0B132B` | Fondos oscuros, texto principal sobre claro |
| `brand-navy` | `#1C2541` | Fondos secundarios, degradados |
| `brand-cyan` | `#00D4FF` | Acento: CTAs, links, activos. **Usar con moderación** |
| `brand-light` | `#F8FAFC` | Fondo principal claro |
| `brand-gray` | `#64748B` | Texto secundario, iconos inactivos, bordes |

Gradiente de marca: diagonal `brand-dark → brand-cyan` (heroes, banners, botones destacados). Token reutilizable.

**Tipografía** — Títulos: **Space Grotesk**. Cuerpo: **Inter** (vía `next/font`).
H1 32/700 · H2 24/600 · H3 20/600 · Body 16/400 · Small 14/400.

**Bordes y sombras** — radio `8px` (pequeños) / `16px` (cards). Sombras con tinte navy, ej. `rgba(11,19,43,0.08)`, nunca negro puro.

**Identidad** — geométrica, tecnológica, con profundidad (3D/degradado), no plana. No deformar el hexágono del logo ni cambiar el ángulo del degradado.

## UX del wizard

- **Progressive profiling**: cada etapa es una pantalla corta e independiente (1-2 min).
- **Guardar y continuar**: persistir el progreso; el usuario retoma donde quedó.
- **Barra de completitud** visible ("Tu CV Vivo está X% completo").
- Universidad y carrera del Paso 1 **se pre-cargan** en la etapa 4; no se vuelven a pedir.
- Incentivo: al 100% de completitud, insignia especial visible para empresas (badge de completitud).
- Cada etapa explica brevemente **para qué** sirve el dato.

## Fuera de alcance

- **Video-Pitch**: solo reservar `video_pitch_url` en `profiles`. Sin UI de grabación/carga.
- KYC académico completo, challenges, Beway Score, validación de pares: son de la plataforma final.
