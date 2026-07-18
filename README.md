# BeWay — Pre-Registro

Formulario de pre-registro para BeWay (plataforma de "CV Vivo" que conecta estudiantes con empresas). Captura leads antes del lanzamiento y permite, opcionalmente, llenar el CV Vivo por etapas.

> La especificación completa (stack, modelo de datos, seguridad, GDPR, diseño, UX) vive en [`CLAUDE.md`](./CLAUDE.md) — es la fuente de verdad del proyecto y la sigue Claude Code al escribir código. Este README cubre solo cómo levantar el entorno.

## Estado actual del repo

Este repo está en fase de **planificación/setup**: todavía no hay una app Next.js generada (no hay `package.json`). Lo que sí existe:

| Ruta | Qué es |
|---|---|
| `CLAUDE.md` | Especificación completa del proyecto para Claude Code (stack, modelo de datos, seguridad, GDPR, diseño, UX del wizard) |
| `design-tokens.md` | Manual de marca (colores, tipografía, identidad visual) |
| `globals-tokens.css` | Tokens de diseño en CSS, derivados del manual de marca |
| `docs/pending-decisions.md` | Registro vivo de decisiones pendientes (legales/negocio) — lo revisa el agente `planner` antes de planificar |
| `.claude/agents/` | Agentes de Claude Code: `planner`, `implementer`, `tester` |
| `.claude/skills/` | Skills de validación propias del proyecto: `data-model-check`, `design-system-check`, `form-ux-check`, `gdpr-check`, `security-check` |
| `.mcp.json` | Config del servidor MCP de Supabase (proyecto `ejrxjqggivkyphrtwjwk`) |
| `skills-lock.json` | Lock file de las skills externas instaladas (fuente + hash) |
| `.agents/` | Skills externas de Supabase descargadas vía `npx skills add` (no se sube a git, ver abajo) |

## Requisitos previos

- **Node.js** (LTS) y npm/pnpm
- **Docker Desktop** — necesario para levantar Supabase local (`supabase start`)
- **Supabase CLI** ([instalación](https://supabase.com/docs/guides/local-development/cli/getting-started))
- **Claude Code** — `npm install -g @anthropic-ai/claude-code` (todo el flujo de desarrollo de este repo está diseñado alrededor de sus agentes y skills)
- **Git**

## Primeros pasos (por persona, tras clonar)

1. **Clona el repositorio** y entra a la carpeta.

2. **Reinstala las skills de Supabase.** Se instalaron originalmente con:
   ```
   npx skills add supabase/agent-skills
   ```
   Esto descarga el contenido en `.agents/skills/` y crea symlinks en `.claude/skills/supabase` y `.claude/skills/supabase-postgres-best-practices`. Como esos symlinks usan rutas absolutas de la máquina donde se instalaron, **no viajan por git** (están en `.gitignore`) — cada persona del equipo debe correr ese comando una vez después de clonar.

3. **Abre Claude Code** (`claude`) en la carpeta del repo y aprueba la conexión al servidor MCP de Supabase (`.mcp.json`) cuando lo pida — usa OAuth, no requiere copiar tokens a mano.

4. **Variables de entorno.** Aún no existe `.env.example` porque no hay app generada todavía. Cuando se scaffoldee el proyecto Next.js, se necesitará un `.env.local` (nunca se commitea, ver `.gitignore`) con, al menos:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — del proyecto Supabase (región UE/Frankfurt)
   - `SUPABASE_SERVICE_ROLE_KEY` — **solo servidor**, nunca exponer al cliente
   - `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (instancia en región UE)
   - `RESEND_API_KEY` (opcional en esta fase)

5. **Supabase local (día a día):**
   ```
   supabase init      # si no está inicializado
   supabase start     # levanta Postgres + Auth + Storage en Docker
   ```
   Los correos de Auth se interceptan localmente en `localhost:54324` (Inbucket/Mailpit), sin salir a internet.

6. **Vincula el proyecto cloud correspondiente** cuando toque trabajar contra staging:
   ```
   supabase link --project-ref <ref-del-proyecto>
   ```
   Hay **dos proyectos cloud separados, ambos en región UE (Frankfurt)**: uno para preview/staging (donde apuntan los Preview Deployments de Vercel) y otro para producción (se crea cerca del lanzamiento). Nunca apuntar un entorno local o de pruebas a producción.

7. Cuando exista la app Next.js: `npm install` y `npm run dev`.

## Convenciones de desarrollo

Resumen — el detalle completo está en `CLAUDE.md`:

- Server Components por defecto; `"use client"` solo donde hay interactividad.
- Server Actions para mutaciones, no rutas API (salvo webhooks).
- Un solo schema de **zod** por etapa, compartido entre cliente y servidor — nunca confiar solo en validación de cliente.
- Migraciones (`supabase migration new`) son la única fuente de verdad del esquema; nada de cambios a mano en el dashboard.
- Tipos de Supabase generados (`supabase gen types`), no escritos a mano.
- RLS obligatorio en toda tabla nueva.

## Seguridad y GDPR

El checklist técnico de privacidad vive en la skill `gdpr-check` y el estado de las decisiones legales pendientes (retención de leads, texto legal de Política de Privacidad, DPAs de terceros, gate de edad, etc.) en [`docs/pending-decisions.md`](./docs/pending-decisions.md). Nada de esto sustituye revisión legal — sigue pendiente validación por un abogado especializado en protección de datos.

## Notas para quien suba/clone este repo

- `.claude/settings.local.json` y `.agents/` **no se suben a git** (son locales/regenerables) — revisa `.gitignore` antes de forzar un `git add -A`.
- La service role key de Supabase nunca debe salir del servidor ni quedar hardcodeada en ningún archivo del repo.
- No subir capturas ni exports con datos personales reales a este repositorio.
