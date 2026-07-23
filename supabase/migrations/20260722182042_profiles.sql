-- profiles — 1:1 con auth.users. Cuenta (Paso 1) + información personal y
-- de presentación (etapas 2-3). CLAUDE.md > Modelo de datos.
--
-- IMPORTANTE (contrato con la Server Action de registro): esta tabla NO se
-- puebla vía trigger sobre auth.users. `full_name`, `terms_accepted_at` y
-- demás datos del formulario no existen en auth.users, así que un trigger
-- solo podría insertar una fila a medias. En su lugar, la Server Action de
-- registro debe, tras un `supabase.auth.signUp()` exitoso, insertar
-- explícitamente la fila de `profiles` con `id = auth user id` en el mismo
-- flujo. Si esa segunda escritura falla, el usuario de auth queda sin
-- perfil — la Server Action debe manejar y reintentar ese caso.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  country_id text references public.countries (id),
  university_id bigint references public.universities (id),
  study_field_id bigint references public.study_fields (id),
  academic_status_id smallint references public.academic_status (id),
  referral_source_id smallint references public.referral_sources (id),
  headline text,
  bio text,
  profile_photo_url text,
  -- Reservado para Video-Pitch (fuera de alcance de esta fase, sin UI).
  video_pitch_url text,
  -- Consentimientos separados (CLAUDE.md > Seguridad): términos es
  -- obligatorio (not null), marketing es opcional (default false).
  terms_accepted_at timestamptz not null,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_country_id_idx on public.profiles (country_id);
create index profiles_university_id_idx on public.profiles (university_id);
create index profiles_study_field_id_idx on public.profiles (study_field_id);
create index profiles_academic_status_id_idx on public.profiles (academic_status_id);
create index profiles_referral_source_id_idx on public.profiles (referral_source_id);

-- Función compartida de mantenimiento de `updated_at`, reutilizada por
-- todas las tablas de este esquema que tengan esa columna.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Solo el propio usuario ve/edita su perfil. Sin policy de delete: el
-- borrado de cuenta (GDPR) pasa por supabase.auth.admin.deleteUser() con
-- service role, que al borrar auth.users cascada sobre profiles (y desde
-- ahí sobre todas las tablas hijas) en una sola operación consistente.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid () = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid () = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid () = id)
  with check (auth.uid () = id);

-- RLS solo filtra filas — sin el GRANT de base, Postgres deniega el
-- acceso a la tabla antes de evaluar las policies. Sin `delete` para
-- `authenticated`: no hay policy de delete (ver comentario arriba), así
-- que otorgarlo no abriría nada, pero se omite para que el GRANT refleje
-- exactamente lo que las policies permiten.
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;
