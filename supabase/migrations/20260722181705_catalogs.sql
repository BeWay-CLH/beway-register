-- Catálogos (lookup) — fuente única de verdad para todo dropdown del wizard.
-- CLAUDE.md > Modelo de datos: "Añadir opciones = insertar fila, no tocar
-- código." Lectura pública (RLS `using (true)`, sin `to`, aplica a anon y
-- authenticated — necesario porque el registro se lee antes de iniciar
-- sesión). Escritura solo service role: a propósito no se crea ninguna
-- policy de insert/update/delete, así que solo el service role (que
-- bypassea RLS) puede modificarlos.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- countries — ISO 3166-1 alpha-2 como id, estable y legible en joins/debug.
-- ---------------------------------------------------------------------
create table public.countries (
  id text primary key check (id = upper(id) and length(id) = 2),
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.countries enable row level security;
create policy "countries_public_read" on public.countries for select using (true);

insert into public.countries (id, name, sort_order) values
  ('ES', 'España', 0),
  ('MX', 'México', 1),
  ('CO', 'Colombia', 2),
  ('AR', 'Argentina', 3),
  ('CL', 'Chile', 4),
  ('PE', 'Perú', 5),
  ('EC', 'Ecuador', 6),
  ('VE', 'Venezuela', 7),
  ('UY', 'Uruguay', 8),
  ('PY', 'Paraguay', 9),
  ('BO', 'Bolivia', 10),
  ('CR', 'Costa Rica', 11),
  ('PA', 'Panamá', 12),
  ('DO', 'República Dominicana', 13),
  ('GT', 'Guatemala', 14),
  ('HN', 'Honduras', 15),
  ('SV', 'El Salvador', 16),
  ('NI', 'Nicaragua', 17),
  ('CU', 'Cuba', 18),
  ('PR', 'Puerto Rico', 19),
  ('US', 'Estados Unidos', 20),
  ('PT', 'Portugal', 21),
  ('BR', 'Brasil', 22),
  ('FR', 'Francia', 23),
  ('DE', 'Alemania', 24),
  ('IT', 'Italia', 25),
  ('GB', 'Reino Unido', 26),
  ('AD', 'Andorra', 27),
  ('OT', 'Otro país', 999);

-- ---------------------------------------------------------------------
-- universities — catálogo abierto, crece por inserción a medida que se
-- registran usuarios de nuevas instituciones. Semilla mínima de partida.
-- ---------------------------------------------------------------------
create table public.universities (
  id bigint generated always as identity primary key,
  name text not null,
  country_id text references public.countries (id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, country_id)
);

create index universities_country_id_idx on public.universities (country_id);

alter table public.universities enable row level security;
create policy "universities_public_read" on public.universities for select using (true);

insert into public.universities (name, country_id) values
  ('Universidad Complutense de Madrid', 'ES'),
  ('Universidad Politécnica de Madrid', 'ES'),
  ('Universidad de Barcelona', 'ES'),
  ('Universitat Politècnica de Catalunya', 'ES'),
  ('Universidad Nacional Autónoma de México', 'MX'),
  ('Instituto Tecnológico y de Estudios Superiores de Monterrey', 'MX'),
  ('Universidad Nacional de Colombia', 'CO'),
  ('Universidad de los Andes', 'CO'),
  ('Universidad de Buenos Aires', 'AR'),
  ('Pontificia Universidad Católica de Chile', 'CL'),
  ('Otra universidad', null);

-- ---------------------------------------------------------------------
-- study_fields — carreras/áreas de estudio.
-- ---------------------------------------------------------------------
create table public.study_fields (
  id bigint generated always as identity primary key,
  name text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.study_fields enable row level security;
create policy "study_fields_public_read" on public.study_fields for select using (true);

insert into public.study_fields (name, sort_order) values
  ('Ingeniería de Sistemas / Informática', 0),
  ('Ingeniería Industrial', 1),
  ('Ingeniería Civil', 2),
  ('Administración de Empresas', 3),
  ('Economía', 4),
  ('Contaduría / Finanzas', 5),
  ('Marketing', 6),
  ('Derecho', 7),
  ('Psicología', 8),
  ('Diseño', 9),
  ('Comunicación', 10),
  ('Ciencia de Datos', 11),
  ('Medicina', 12),
  ('Arquitectura', 13),
  ('Otra', 999);

-- ---------------------------------------------------------------------
-- academic_status — situación académica actual.
-- ---------------------------------------------------------------------
create table public.academic_status (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.academic_status enable row level security;
create policy "academic_status_public_read" on public.academic_status for select using (true);

insert into public.academic_status (code, name, sort_order) values
  ('studying', 'Estudiando actualmente', 0),
  ('graduated', 'Graduado/a', 1),
  ('on_leave', 'Estudios en pausa', 2),
  ('dropped_out', 'Estudios interrumpidos', 3);

-- ---------------------------------------------------------------------
-- languages_catalog + proficiency_levels
-- ---------------------------------------------------------------------
create table public.languages_catalog (
  id smallint generated always as identity primary key,
  iso_code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.languages_catalog enable row level security;
create policy "languages_catalog_public_read" on public.languages_catalog for select using (true);

insert into public.languages_catalog (iso_code, name, sort_order) values
  ('es', 'Español', 0),
  ('en', 'Inglés', 1),
  ('pt', 'Portugués', 2),
  ('fr', 'Francés', 3),
  ('de', 'Alemán', 4),
  ('it', 'Italiano', 5),
  ('ca', 'Catalán', 6);

create table public.proficiency_levels (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.proficiency_levels enable row level security;
create policy "proficiency_levels_public_read" on public.proficiency_levels for select using (true);

insert into public.proficiency_levels (code, name, sort_order) values
  ('basic', 'Básico', 0),
  ('intermediate', 'Intermedio', 1),
  ('advanced', 'Avanzado', 2),
  ('native', 'Nativo / Bilingüe', 3);

-- ---------------------------------------------------------------------
-- referral_sources — "¿cómo te enteraste?"
-- ---------------------------------------------------------------------
create table public.referral_sources (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.referral_sources enable row level security;
create policy "referral_sources_public_read" on public.referral_sources for select using (true);

insert into public.referral_sources (code, name, sort_order) values
  ('social_media', 'Redes sociales', 0),
  ('university', 'Mi universidad', 1),
  ('friend_referral', 'Un amigo/a me recomendó', 2),
  ('search_engine', 'Buscador (Google, etc.)', 3),
  ('event', 'Evento o feria de empleo', 4),
  ('other', 'Otro', 999);

-- ---------------------------------------------------------------------
-- opportunity_types, work_modalities, sectors, availability_options
-- (preferencias profesionales, etapa 9)
-- ---------------------------------------------------------------------
create table public.opportunity_types (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.opportunity_types enable row level security;
create policy "opportunity_types_public_read" on public.opportunity_types for select using (true);

insert into public.opportunity_types (code, name, sort_order) values
  ('internship', 'Prácticas / Pasantía', 0),
  ('first_job', 'Primer empleo', 1),
  ('part_time', 'Medio tiempo', 2),
  ('full_time', 'Tiempo completo', 3),
  ('freelance', 'Freelance / Proyectos', 4);

create table public.work_modalities (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.work_modalities enable row level security;
create policy "work_modalities_public_read" on public.work_modalities for select using (true);

insert into public.work_modalities (code, name, sort_order) values
  ('remote', 'Remoto', 0),
  ('hybrid', 'Híbrido', 1),
  ('onsite', 'Presencial', 2);

create table public.sectors (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.sectors enable row level security;
create policy "sectors_public_read" on public.sectors for select using (true);

insert into public.sectors (code, name, sort_order) values
  ('tech', 'Tecnología / Software', 0),
  ('finance', 'Finanzas', 1),
  ('marketing', 'Marketing / Publicidad', 2),
  ('health', 'Salud', 3),
  ('education', 'Educación', 4),
  ('retail', 'Retail / Consumo', 5),
  ('manufacturing', 'Manufactura / Industria', 6),
  ('consulting', 'Consultoría', 7),
  ('public_sector', 'Sector público', 8),
  ('other', 'Otro', 999);

create table public.availability_options (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.availability_options enable row level security;
create policy "availability_options_public_read" on public.availability_options for select using (true);

insert into public.availability_options (code, name, sort_order) values
  ('immediate', 'Inmediata', 0),
  ('within_1_month', 'En 1 mes', 1),
  ('within_3_months', 'En 3 meses', 2),
  ('not_available', 'No disponible por ahora', 3);

-- ---------------------------------------------------------------------
-- experience_types, project_types, certification_types
-- ---------------------------------------------------------------------
create table public.experience_types (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.experience_types enable row level security;
create policy "experience_types_public_read" on public.experience_types for select using (true);

insert into public.experience_types (code, name, sort_order) values
  ('internship', 'Prácticas / Pasantía', 0),
  ('part_time', 'Medio tiempo', 1),
  ('full_time', 'Tiempo completo', 2),
  ('freelance', 'Freelance', 3),
  ('volunteer', 'Voluntariado', 4);

create table public.project_types (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.project_types enable row level security;
create policy "project_types_public_read" on public.project_types for select using (true);

insert into public.project_types (code, name, sort_order) values
  ('academic', 'Proyecto académico', 0),
  ('personal', 'Proyecto personal', 1),
  ('freelance', 'Proyecto freelance', 2),
  ('hackathon', 'Hackathon', 3),
  ('volunteer', 'Actividad de voluntariado', 4),
  ('extracurricular', 'Actividad extracurricular', 5);

create table public.certification_types (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

alter table public.certification_types enable row level security;
create policy "certification_types_public_read" on public.certification_types for select using (true);

insert into public.certification_types (code, name, sort_order) values
  ('course', 'Curso', 0),
  ('bootcamp', 'Bootcamp', 1),
  ('certification', 'Certificación profesional', 2),
  ('workshop', 'Taller / Workshop', 3),
  ('diploma', 'Diplomado', 4);

-- -----------------------------------------------------------------------
-- Grants. RLS solo filtra filas — sin el GRANT de base, Postgres deniega
-- el acceso a la tabla antes de siquiera evaluar las policies. `anon`
-- también necesita SELECT: el registro (Paso 1) lee estos catálogos antes
-- de que exista una sesión.
-- -----------------------------------------------------------------------
grant select on table
  public.countries,
  public.universities,
  public.study_fields,
  public.academic_status,
  public.languages_catalog,
  public.proficiency_levels,
  public.referral_sources,
  public.opportunity_types,
  public.work_modalities,
  public.sectors,
  public.availability_options,
  public.experience_types,
  public.project_types,
  public.certification_types
to anon, authenticated;

grant select, insert, update, delete on table
  public.countries,
  public.universities,
  public.study_fields,
  public.academic_status,
  public.languages_catalog,
  public.proficiency_levels,
  public.referral_sources,
  public.opportunity_types,
  public.work_modalities,
  public.sectors,
  public.availability_options,
  public.experience_types,
  public.project_types,
  public.certification_types
to service_role;
