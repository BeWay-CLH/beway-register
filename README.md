# BeWay — Pre-Registro

Formulario de pre-registro para BeWay (plataforma de "CV Vivo" que conecta estudiantes con empresas). Captura leads antes del lanzamiento y permite, opcionalmente, llenar el CV Vivo por etapas.

> La especificación completa (stack, modelo de datos, seguridad, GDPR, diseño, UX) vive en [`CLAUDE.md`](./CLAUDE.md) — es la fuente de verdad del proyecto y la sigue Claude Code al escribir código. Este README cubre solo cómo levantar el entorno.

## Estado actual del repo

App Next.js scaffoldeada (App Router, TypeScript estricto, Tailwind) y esquema inicial de base de datos ya escrito como migraciones de Supabase. Aún no hay Server Actions ni el formulario real de registro — ver [`docs/pending-decisions.md`](./docs/pending-decisions.md) y las tareas abiertas del equipo para lo siguiente.

| Ruta | Qué es |
|---|---|
| `CLAUDE.md` | Especificación completa del proyecto para Claude Code (stack, modelo de datos, seguridad, GDPR, diseño, UX del wizard) |
| `app/`, `components/`, `lib/` | App Next.js (ver estructura de carpetas en `CLAUDE.md`) |
| `supabase/migrations/` | Esquema de base de datos versionado — ver [Base de datos](#base-de-datos--migraciones) más abajo |
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

4. **Variables de entorno.** Copia `.env.example` a `.env.local` (nunca se commitea, ver `.gitignore`) y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — del proyecto Supabase (región UE/Frankfurt)
   - `SUPABASE_SERVICE_ROLE_KEY` — **solo servidor**, nunca exponer al cliente
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` (pendiente hasta tener dominio propio)
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (instancia en región UE)
   - `RESEND_API_KEY` (opcional en esta fase)

5. **Instala dependencias y levanta la app:**
   ```
   npm install
   npm run dev
   ```

6. **Base de datos** — ver la sección siguiente para levantar Supabase local y aplicar las migraciones.

## Base de datos — migraciones

El esquema completo (`profiles`, entradas repetibles del CV Vivo, catálogos, preferencias, privacidad) vive versionado en `supabase/migrations/`. Es la única fuente de verdad del esquema — nunca editar tablas a mano desde el dashboard (ver `CONTRIBUTING.md`).

### Local (día a día)

```
supabase start     # levanta Postgres + Auth + Storage en Docker (primera vez descarga imágenes, tarda unos minutos)
supabase db reset  # aplica todas las migraciones desde cero contra el Postgres local
```

`db reset` es seguro de correr las veces que haga falta: borra y recrea la base local aplicando `supabase/migrations/` en orden. Los correos de Auth se interceptan localmente en `localhost:54324` (Inbucket/Mailpit), sin salir a internet. El Studio local queda en `localhost:54323` para inspeccionar tablas/RLS con la UI.

> **Docker Desktop en Windows**: el servicio de `analytics` (logflare) requiere el daemon de Docker expuesto por TCP, que no viene habilitado por defecto — sin eso, `supabase start` falla o hace rollback de todo el stack. Por eso `supabase/config.toml` trae `[analytics] enabled = false`. Si tu equipo necesita analytics local, expón el daemon por TCP en Docker Desktop y reactívalo ahí.

`lib/supabase/database.types.ts` ya está generado y commiteado, y `lib/supabase/client.ts` / `server.ts` ya están tipados con `createClient<Database>(...)`. Cada vez que cambie el esquema (migración nueva), regenera ese archivo — **nunca se escribe a mano**:

```
supabase gen types typescript --local > lib/supabase/database.types.ts
```

### Aplicar a un proyecto cloud (staging o producción)

Cada proyecto cloud (staging y producción son **proyectos separados**, ver `CLAUDE.md` > Entornos) se vincula y sincroniza así:

```
supabase link --project-ref <ref-del-proyecto>
supabase db push
```

`db push` aplica solo las migraciones que ese proyecto todavía no tiene (lleva su propio historial en `supabase_migrations.schema_migrations`), así que es seguro correrlo repetidamente. Para el proyecto de staging ya vinculado en `.mcp.json` (`ejrxjqggivkyphrtwjwk`):

```
supabase link --project-ref ejrxjqggivkyphrtwjwk
supabase db push
```

**Antes de mergear una migración nueva a `main`**: `git pull origin main`, corre `supabase db reset` local para confirmar que aplica limpio sobre el estado más reciente (no sobre el estado de cuando abriste tu rama) — ver `CONTRIBUTING.md` sobre coordinación de migraciones con varias personas tocando el esquema.

### Qué contienen las migraciones iniciales

1. `catalogs` — todas las tablas de catálogo (países, universidades, carreras, idiomas, etc.) con lectura pública y semillas iniciales en español. Añadir opciones = `insert` una fila, no tocar código.
2. `profiles` — cuenta + info personal (Pasos 1-3). **Importante para quien construya el registro**: no hay trigger automático sobre `auth.users` — la Server Action de signup debe insertar la fila de `profiles` explícitamente (`id = id del usuario recién creado`) justo después de `supabase.auth.signUp()`, porque campos como `full_name` o `terms_accepted_at` no existen en `auth.users`.
3. `profile_entries` — `education`, `experiences`, `projects`, `certifications`, `skills`, `languages`, `evidences`. `experiences`/`projects`/`certifications` aplican el límite de 3 vía un trigger compartido (`enforce_max_entries_per_profile`); subir el límite en el futuro es cambiar el argumento del trigger, no rediseñar el esquema.
4. `preferences_and_privacy` — preferencias profesionales (con tablas puente N:M para selección múltiple de tipo de oportunidad/modalidad/sector) y ajustes de privacidad.

Todas las tablas tienen RLS habilitado: cada usuario solo lee/escribe sus propias filas; los catálogos son de lectura pública y escritura solo por service role. El borrado de cuenta (GDPR) se resuelve con `supabase.auth.admin.deleteUser(id)` — al borrar la fila de `auth.users`, la cascada de FKs (`on delete cascade`) limpia `profiles` y todas sus tablas hijas en una sola operación.

**Si agregas una tabla nueva**: RLS habilitado + policies no es suficiente por sí solo — Postgres exige además un `GRANT` de base sobre la tabla para el rol (`anon`/`authenticated`/`service_role`) antes de evaluar las policies; sin el grant, da "permission denied" aunque las policies estén bien. Cada migración de este repo incluye su bloque `grant` al final — cópialo como referencia.

Las 4 migraciones ya se probaron de punta a punta contra Postgres local (Docker): aplican limpio con `supabase db reset`, el aislamiento por usuario vía RLS+grants funciona, el trigger de máximo 3 entradas rechaza la cuarta, y el cascade delete desde `auth.users` limpia todo (perfil, entradas, preferencias) en una sola operación.

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
