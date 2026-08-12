// Límite de entradas repetibles para experiences/projects/certifications
// (CLAUDE.md > Modelo de datos: "Máximo 3 por campo... modelado como 1:N
// para poder extenderse después sin migración"). Único punto de verdad en
// el lado de la app — debe coincidir con el argumento del trigger
// `enforce_max_entries_per_profile('3')` en cada una de las 3 migraciones.
export const MAX_REPEATABLE_ENTRIES = 3;
