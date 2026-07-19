# Guía de Contribución — BeWay Pre-Registro

Flujo de trabajo con Git para el equipo. Es deliberadamente simple: somos 5 desarrolladores con despliegue continuo vía Vercel, no un equipo grande con releases programados. Si una regla de aquí empieza a sentirse pesada, es una señal de que hay que revisarla, no de que hay que ignorarla en silencio.

## Modelo de ramas: trunk-based, no una rama por persona

- **`main` es la única rama larga** y siempre debe estar en estado desplegable. Protegida: nada de push directo, todo entra por Pull Request con al menos 1 aprobación y CI en verde (lint, typecheck, build, tests).
- **Las ramas se nombran por la tarea, nunca por la persona.** Nada de `juan-branch` o `maria-dev`.
  ```
  feat/registro-paso-1
  fix/validacion-email-duplicado
  chore/actualizar-catalogos-universidades
  ```
- **Vida corta: 1-3 días máximo.** Entre más tiempo viva una rama sin mergear, más caro el conflicto — sobre todo porque varios tocaremos el mismo esquema de Supabase y el mismo `CLAUDE.md`. Abre el PR el mismo día que empiezas la tarea (como draft si aún no está lista) en vez de acumular una semana de cambios antes de mostrarla.

## Commits y Pull Requests

- **Conventional Commits** en el título del PR (que además será el mensaje del squash):
  ```
  feat(registro): añadir validación de correo duplicado
  fix(cv-vivo): corregir prefill de universidad en etapa 4
  chore(catalogos): añadir universidades faltantes
  ```
- **Squash merge siempre.** Cada PR se convierte en un solo commit limpio en `main`, sin importar cuántos "wip" haya dentro de la rama. Facilita `git bisect` y reversiones puntuales.
- **PRs pequeños.** Si una tarea se siente demasiado grande para un PR de un día, probablemente se puede partir en dos.

## Antes de pedir revisión humana: que valide el agente `tester`

Este proyecto tiene skills de validación (`.claude/skills/`) pensados exactamente para esto. Antes de pedir review a un compañero:

1. Corre el agente `tester` sobre tu rama.
2. Que aplique los checklists relevantes según lo que tocaste: `design-system-check` (UI/tokens), `data-model-check` (esquema/migraciones), `security-check` (auth/RLS/rate limiting), `form-ux-check` (wizard), `gdpr-check` (cualquier cosa con datos personales).
3. Corrige lo que el agente señale antes de asignar revisores.

Así la revisión humana se dedica a lo que un agente no puede juzgar bien (si el enfoque tiene sentido, si la UX es la correcta), no a detectar un color hardcodeado o un dropdown sin catálogo.

## Migraciones de Supabase con varias personas tocando el esquema

Es el punto de mayor fricción con 5 personas, así que una disciplina extra aquí paga:

- Cada quien corre `supabase migration new <nombre>` en su propia rama — los archivos llevan timestamp, así que dos personas no se pisan el nombre de archivo.
- **El orden de aplicación sí importa.** Antes de mergear, haz `git pull origin main` y `supabase db reset` localmente para confirmar que tu migración aplica limpio sobre el estado más reciente de `main`, no sobre el estado de cuando abriste la rama.
- Si dos PRs abiertos al mismo tiempo van a tocar la misma tabla, coordinen en el chat del equipo antes de empezar — 30 segundos de aviso ahorran una hora de conflicto de migraciones.
- Nunca editar el esquema a mano desde el dashboard de Supabase cloud. Las migraciones versionadas en `supabase/migrations/` son la única fuente de verdad (ver `CLAUDE.md`).

## Entornos y despliegue

- **Cada PR** → Preview Deployment de Vercel apuntando al proyecto Supabase de **staging** (región UE).
- **Merge a `main`** → despliegue continuo a staging.
- **Producción** → promoción manual, nunca automática. Con datos reales de leads de por medio, ese paso es una decisión consciente de alguien del equipo, no un efecto secundario de un merge.

Detalle completo de entornos local/staging/producción en `CLAUDE.md`.

## Decisiones abiertas o ambiguas

Si durante el desarrollo aparece una ambigüedad de negocio, legal o de producto (no técnica), no la resuelvas por tu cuenta ni la dejes perdida en un comentario de Slack: añádela a `docs/pending-decisions.md` para que quede registrada y visible para todo el equipo.

## Qué evitamos a propósito

- **GitFlow** (`develop`, `release/*`, `hotfix/*`): pensado para ciclos de release largos. Con despliegue continuo vía Vercel es pura fricción sin beneficio para este equipo.
- **Rama por desarrollador**: genera ramas que viven semanas y divergen mucho de `main` — el origen más común de conflictos grandes.
- **Rebase interactivo obligatorio para todo el equipo**: útil para quien ya lo domina, pero no lo volvemos regla — con niveles de experiencia distintos en Git, genera más accidentes (`force push` a la rama equivocada) que beneficio. Squash merge ya nos da un historial limpio sin necesitarlo.
