-- Entradas repetibles del CV Vivo (etapas 4-8, 10): education, experiences,
-- projects, certifications, skills, languages, evidences. Todas 1:N sobre
-- profiles, con RLS "cada quien ve/edita lo suyo" y `profile_id` indexado
-- (la propia policy de RLS filtra por esa columna en cada query).

-- -----------------------------------------------------------------------
-- Función compartida para los límites "máx. 3" (experiences, projects,
-- certifications — CLAUDE.md > Modelo de datos). Un solo trigger function
-- reutilizado por las 3 tablas en vez de triplicar la lógica; el límite se
-- pasa como argumento del trigger, así que subirlo en el futuro es cambiar
-- un argumento, no rediseñar el modelo 1:N.
-- -----------------------------------------------------------------------
create function public.enforce_max_entries_per_profile()
returns trigger
language plpgsql
as $$
declare
  entry_limit integer := tg_argv[0]::integer;
  current_count integer;
begin
  execute format(
    'select count(*) from %I.%I where profile_id = $1',
    tg_table_schema,
    tg_table_name
  )
  into current_count
  using new.profile_id;

  if current_count >= entry_limit then
    raise exception 'Se alcanzó el máximo de % entradas en % por perfil', entry_limit, tg_table_name
      using errcode = '23514'; -- check_violation
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------
-- education (etapa 4) — 1:N, sin límite de cantidad. "Una principal" se
-- modela con `is_primary` + índice único parcial, no con una tabla 1:1.
-- Universidad/carrera del Paso 1 (profiles) se copian aquí como valores
-- iniciales de la primera fila — eso lo hace la app, no un trigger.
-- -----------------------------------------------------------------------
create table public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  university_id bigint references public.universities (id),
  study_field_id bigint references public.study_fields (id),
  academic_status_id smallint references public.academic_status (id),
  start_date date,
  end_date date,
  is_current boolean not null default false,
  is_primary boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index education_profile_id_idx on public.education (profile_id);
create index education_university_id_idx on public.education (university_id);
create index education_study_field_id_idx on public.education (study_field_id);
create unique index education_one_primary_per_profile on public.education (profile_id)
  where is_primary;

create trigger education_set_updated_at
  before update on public.education
  for each row
  execute function public.set_updated_at();

alter table public.education enable row level security;

create policy "education_select_own" on public.education
  for select using (auth.uid () = profile_id);

create policy "education_insert_own" on public.education
  for insert with check (auth.uid () = profile_id);

create policy "education_update_own" on public.education
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "education_delete_own" on public.education
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- experiences (etapa 5) — 1:N, máx. 3.
-- -----------------------------------------------------------------------
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  experience_type_id smallint references public.experience_types (id),
  sector_id smallint references public.sectors (id),
  company_name text not null,
  role_title text not null,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experiences_profile_id_idx on public.experiences (profile_id);
create index experiences_experience_type_id_idx on public.experiences (experience_type_id);
create index experiences_sector_id_idx on public.experiences (sector_id);

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row
  execute function public.set_updated_at();

create trigger experiences_enforce_max_three
  before insert on public.experiences
  for each row
  execute function public.enforce_max_entries_per_profile ('3');

alter table public.experiences enable row level security;

create policy "experiences_select_own" on public.experiences
  for select using (auth.uid () = profile_id);

create policy "experiences_insert_own" on public.experiences
  for insert with check (auth.uid () = profile_id);

create policy "experiences_update_own" on public.experiences
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "experiences_delete_own" on public.experiences
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- projects (etapa 6) — proyectos y actividades. 1:N, máx. 3.
-- -----------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  project_type_id smallint references public.project_types (id),
  name text not null,
  description text,
  url text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_profile_id_idx on public.projects (profile_id);
create index projects_project_type_id_idx on public.projects (project_type_id);

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

create trigger projects_enforce_max_three
  before insert on public.projects
  for each row
  execute function public.enforce_max_entries_per_profile ('3');

alter table public.projects enable row level security;

create policy "projects_select_own" on public.projects
  for select using (auth.uid () = profile_id);

create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid () = profile_id);

create policy "projects_update_own" on public.projects
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "projects_delete_own" on public.projects
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- certifications (etapa 8) — formación complementaria. 1:N, máx. 3.
-- -----------------------------------------------------------------------
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  certification_type_id smallint references public.certification_types (id),
  name text not null,
  institution text,
  issue_date date,
  credential_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index certifications_profile_id_idx on public.certifications (profile_id);
create index certifications_certification_type_id_idx on public.certifications (certification_type_id);

create trigger certifications_set_updated_at
  before update on public.certifications
  for each row
  execute function public.set_updated_at();

create trigger certifications_enforce_max_three
  before insert on public.certifications
  for each row
  execute function public.enforce_max_entries_per_profile ('3');

alter table public.certifications enable row level security;

create policy "certifications_select_own" on public.certifications
  for select using (auth.uid () = profile_id);

create policy "certifications_insert_own" on public.certifications
  for insert with check (auth.uid () = profile_id);

create policy "certifications_update_own" on public.certifications
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "certifications_delete_own" on public.certifications
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- skills (etapa 7) — texto libre (tags), no hay catálogo de habilidades.
-- -----------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index skills_profile_id_idx on public.skills (profile_id);
create unique index skills_profile_id_name_unique on public.skills (profile_id, lower(name));

alter table public.skills enable row level security;

create policy "skills_select_own" on public.skills
  for select using (auth.uid () = profile_id);

create policy "skills_insert_own" on public.skills
  for insert with check (auth.uid () = profile_id);

create policy "skills_update_own" on public.skills
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "skills_delete_own" on public.skills
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- languages (etapa 7) — idioma + nivel, ambos de catálogo.
-- -----------------------------------------------------------------------
create table public.languages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  language_id smallint not null references public.languages_catalog (id),
  proficiency_level_id smallint not null references public.proficiency_levels (id),
  created_at timestamptz not null default now(),
  unique (profile_id, language_id)
);

create index languages_profile_id_idx on public.languages (profile_id);
create index languages_language_id_idx on public.languages (language_id);

alter table public.languages enable row level security;

create policy "languages_select_own" on public.languages
  for select using (auth.uid () = profile_id);

create policy "languages_insert_own" on public.languages
  for insert with check (auth.uid () = profile_id);

create policy "languages_update_own" on public.languages
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "languages_delete_own" on public.languages
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- evidences (etapa 10) — enlaces externos (portfolio, GitHub, etc.).
-- -----------------------------------------------------------------------
create table public.evidences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index evidences_profile_id_idx on public.evidences (profile_id);

alter table public.evidences enable row level security;

create policy "evidences_select_own" on public.evidences
  for select using (auth.uid () = profile_id);

create policy "evidences_insert_own" on public.evidences
  for insert with check (auth.uid () = profile_id);

create policy "evidences_update_own" on public.evidences
  for update using (auth.uid () = profile_id)
  with check (auth.uid () = profile_id);

create policy "evidences_delete_own" on public.evidences
  for delete using (auth.uid () = profile_id);

-- -----------------------------------------------------------------------
-- Grants. RLS solo filtra filas — sin el GRANT de base, Postgres deniega
-- el acceso a la tabla antes de evaluar las policies de arriba.
-- -----------------------------------------------------------------------
grant select, insert, update, delete on table
  public.education,
  public.experiences,
  public.projects,
  public.certifications,
  public.skills,
  public.languages,
  public.evidences
to authenticated, service_role;
