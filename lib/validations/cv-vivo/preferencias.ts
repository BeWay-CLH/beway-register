import { z } from "zod";

// Etapa 9 — preferencias profesionales (CLAUDE.md > Modelo de datos >
// preferences + tablas puente N:M). Disponibilidad es el único campo
// requerido (define completitud, ver lib/cv-vivo/stages.ts); las tres
// selecciones múltiples son opcionales — cada guardado reemplaza por
// completo el conjunto seleccionado en cada categoría, no es un "agregar".
export const preferencesSchema = z.object({
  availabilityOptionId: z.coerce.number().int().positive("Selecciona tu disponibilidad."),
  opportunityTypeIds: z.array(z.number().int()).default([]),
  workModalityIds: z.array(z.number().int()).default([]),
  sectorIds: z.array(z.number().int()).default([]),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
