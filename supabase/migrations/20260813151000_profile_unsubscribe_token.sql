-- Token de baja de un clic para los correos de comunicación (#3/#4/#5/#7,
-- docs/email-strategy.md). CLAUDE.md > Seguridad: "No poner datos
-- personales en query params ni en URLs" — un enlace de baja necesita
-- identificar al destinatario sin sesión iniciada, así que en vez de
-- poner profiles.id (dato personal identificable) en la URL, se genera un
-- token opaco y aleatorio aparte, sin relación derivable con el id. Mismo
-- criterio que el token_hash de Supabase Auth en /auth/confirm: un
-- credential de un solo propósito, no un identificador personal.
alter table public.profiles
  add column unsubscribe_token uuid not null default gen_random_uuid() unique;

create index profiles_unsubscribe_token_idx on public.profiles (unsubscribe_token);
