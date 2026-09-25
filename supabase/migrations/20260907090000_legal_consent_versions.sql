-- Alinea el backend con "BeWay | Pre-Registro · Cambios UX + legal" (v3.0,
-- sept. 2026), sección "5. Backend: reglas mínimas".

-- Perfil privado por defecto: la migración original (20260722184639)
-- arrancaba en 'companies_only'. El documento legal es explícito: crear una
-- cuenta no debe hacer nada visible para empresas por defecto.
alter table public.privacy_settings
  alter column profile_visibility set default 'private';

-- Versionado de consentimientos. `terms_accepted_at` ya existía; falta
-- registrar QUÉ versión del documento se aceptó (para poder pedir
-- re-aceptación si el texto legal cambia de forma material) y, para
-- Privacidad (que no lleva checkbox), qué versión se le presentó al
-- usuario y cuándo.
alter table public.profiles
  add column terms_version text not null default '1.0',
  add column privacy_notice_version text not null default '1.0',
  add column privacy_notice_presented_at timestamptz not null default now();

-- Página pública "/derechos" (Art. 15-21 RGPD): permite ejercer derechos sin
-- necesitar que el interesado ya tenga sesión iniciada (ej. alguien que
-- quiere que se elimine un lead que nunca completó el registro). Solo
-- inserción pública; nadie fuera de service_role puede leer estas filas —
-- la triage es manual por parte de quien gestione [EMAIL PRIVACIDAD].
create table public.rights_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null
    check (request_type in ('access', 'rectification', 'erasure', 'limitation', 'objection', 'portability', 'consent_withdrawal', 'other')),
  email text not null,
  details text,
  created_at timestamptz not null default now()
);

alter table public.rights_requests enable row level security;

create policy "rights_requests_insert_public" on public.rights_requests
  for insert with check (true);

-- Sin policy de select/update/delete para anon/authenticated: solo
-- service_role gestiona estas solicitudes (mismo patrón que la exclusión de
-- `delete` en profiles, ver 20260722182042_profiles.sql).
grant insert on table public.rights_requests to anon, authenticated;
grant select, insert, update, delete on table public.rights_requests to service_role;
