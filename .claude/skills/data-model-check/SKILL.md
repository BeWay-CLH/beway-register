---
name: data-model-check
description: Use whenever writing or validating Supabase migrations, schema changes, or data-access code for BeWay, to confirm table relations, catalog (lookup) tables, and repeatable-field limits match the specification.
---

# BeWay Data Model — Referencia y Checklist

## Relaciones esperadas

- `profiles` — 1:1 con `auth.users`. Cuenta + información personal + presentación (etapas 1-3). Incluye `video_pitch_url` reservado (sin UI todavía).
- `education` — 1:N (una entrada principal en esta fase de pre-registro).
- `experiences`, `projects`, `certifications` — 1:N, **máximo 3 filas activas por usuario**, para permitir subir el límite después sin migración.
- `skills`, `languages`, `evidences` — 1:N.
- `preferences`, `privacy_settings` — 1:1.

## Catálogos obligatorios (fuente única de verdad)

Toda opción de dropdown vive en una tabla de catálogo con seed en migraciones, referenciada por FK — nunca hardcodeada en el frontend:

`countries`, `universities`, `study_fields`, `academic_status`, `languages_catalog`, `proficiency_levels`, `referral_sources`, `opportunity_types`, `work_modalities`, `sectors`, `availability_options`, `experience_types`, `project_types`, `certification_types`.

## Checklist de validación

- [ ] ¿RLS habilitado en toda tabla que contenga datos de usuario?
- [ ] ¿Las tablas de catálogo permiten lectura pública pero escritura solo desde `service_role`?
- [ ] ¿El límite de 3 registros en `experiences`, `projects` y `certifications` está reforzado con constraint o trigger en Postgres, no solo validado en zod?
- [ ] ¿Cada campo tipo dropdown del formulario lee de una tabla de catálogo en vez de un array/enum hardcodeado en el frontend?
- [ ] ¿Universidad y carrera se leen del perfil (capturados en el Paso 1) al llenar la etapa de Formación, sin pedirse de nuevo?
- [ ] ¿Los tipos de TypeScript para las tablas están generados desde Supabase (`supabase gen types`), no escritos a mano?
- [ ] ¿Añadir una nueva opción a un catálogo requiere solo un `insert`, sin tocar código de la aplicación?
