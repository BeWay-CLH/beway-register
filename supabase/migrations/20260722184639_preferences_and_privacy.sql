-- preferences (etapa 9) y privacy_settings (etapa 11) — ambas 1:1 con
-- profiles, así que usan `profile_id` como PK (no hace falta un `id`
-- propio). CLAUDE.md > Modelo de datos.
--
-- Las preferencias multi-selección (tipo de oportunidad, modalidad,
-- sector) se modelan como tablas puente N:M normalizadas en vez de
-- columnas array — así cada combinación queda indexada y es trivial para
-- el lado empresa filtrar candidatos ("remoto + sector fintech"), que es
-- justo el caso de uso que estas preferencias existen para servir.

create table public.preferences (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  availability_option_id smallint references public.availability_options (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index preferences_availability_option_id_idx on public.preferences (availability_option_id);

create trigger preferences_set_updated_at
  before update on public.preferences
  for each row
  execute function public.set_updated_at();

alter table public.preferences enable row level security;

create policy "preferences_select_own" on public.preferences
  for select using (auth.uid () = profile_id);

create policy "preferences_insert_own" on public.preferences
  for insert with check (auth.uid () = profile_id);

create policy "preferences_update_own" on public.preferences
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "preferences_delete_own" on public.preferences
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- Tablas puente N:M. `profile_id` viaja también en cada fila (no solo
-- `preferences.profile_id`) para que la policy de RLS compare
-- directamente contra auth.uid() sin necesitar un EXISTS contra
-- `preferences`.
-- -----------------------------------------------------------------------
create table public.preference_opportunity_types (
  profile_id uuid not null references public.preferences (profile_id) on delete cascade,
  opportunity_type_id smallint not null references public.opportunity_types (id),
  primary key (profile_id, opportunity_type_id)
);

alter table public.preference_opportunity_types enable row level security;

create policy "preference_opportunity_types_select_own" on public.preference_opportunity_types
  for select using (auth.uid () = profile_id);

create policy "preference_opportunity_types_insert_own" on public.preference_opportunity_types
  for insert with check (auth.uid () = profile_id);

create policy "preference_opportunity_types_delete_own" on public.preference_opportunity_types
  for delete using (auth.uid () = profile_id);

create table public.preference_work_modalities (
  profile_id uuid not null references public.preferences (profile_id) on delete cascade,
  work_modality_id smallint not null references public.work_modalities (id),
  primary key (profile_id, work_modality_id)
);

alter table public.preference_work_modalities enable row level security;

create policy "preference_work_modalities_select_own" on public.preference_work_modalities
  for select using (auth.uid () = profile_id);

create policy "preference_work_modalities_insert_own" on public.preference_work_modalities
  for insert with check (auth.uid () = profile_id);

create policy "preference_work_modalities_delete_own" on public.preference_work_modalities
  for delete using (auth.uid () = profile_id);

create table public.preference_sectors (
  profile_id uuid not null references public.preferences (profile_id) on delete cascade,
  sector_id smallint not null references public.sectors (id),
  primary key (profile_id, sector_id)
);

alter table public.preference_sectors enable row level security;

create policy "preference_sectors_select_own" on public.preference_sectors
  for select using (auth.uid () = profile_id);

create policy "preference_sectors_insert_own" on public.preference_sectors
  for insert with check (auth.uid () = profile_id);

create policy "preference_sectors_delete_own" on public.preference_sectors
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- privacy_settings (etapa 11) — visibilidad y contacto.
-- -----------------------------------------------------------------------
create table public.privacy_settings (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  profile_visibility text not null default 'companies_only'
    check (profile_visibility in ('public', 'companies_only', 'private')),
  show_contact_email boolean not null default false,
  show_contact_phone boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger privacy_settings_set_updated_at
  before update on public.privacy_settings
  for each row
  execute function public.set_updated_at();

alter table public.privacy_settings enable row level security;

create policy "privacy_settings_select_own" on public.privacy_settings
  for select using (auth.uid () = profile_id);

create policy "privacy_settings_insert_own" on public.privacy_settings
  for insert with check (auth.uid () = profile_id);

create policy "privacy_settings_update_own" on public.privacy_settings
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "privacy_settings_delete_own" on public.privacy_settings
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- Grants. RLS solo filtra filas — sin el GRANT de base, Postgres deniega
-- el acceso a la tabla antes de evaluar las policies de arriba. Las
-- tablas puente no tienen policy de `update` (se activa/desactiva una
-- opción con insert/delete), así que tampoco se les otorga ese grant.
-- -----------------------------------------------------------------------
grant select, insert, update, delete on table
  public.preferences,
  public.privacy_settings
to authenticated, service_role;

grant select, insert, delete on table
  public.preference_opportunity_types,
  public.preference_work_modalities,
  public.preference_sectors
to authenticated, service_role;
