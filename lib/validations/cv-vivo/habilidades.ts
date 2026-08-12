import { z } from "zod";

// Etapa 7 — habilidades (texto libre, sin catálogo) e idiomas (catálogo +
// nivel de dominio). Ninguna tiene campos opcionales, así que no hace
// falta optionalText aquí (sin transform no hay riesgo de doble-parseo).
export const skillSchema = z.object({
  name: z.string().trim().min(1, "Escribe una habilidad.").max(50, "Máximo 50 caracteres."),
});

export type SkillInput = z.infer<typeof skillSchema>;

export const languageEntrySchema = z.object({
  languageId: z.coerce.number().int().positive("Selecciona un idioma."),
  proficiencyLevelId: z.coerce.number().int().positive("Selecciona tu nivel."),
});

export type LanguageEntryInput = z.infer<typeof languageEntrySchema>;
