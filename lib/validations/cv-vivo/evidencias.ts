import { z } from "zod";

// Etapa 10 — un enlace externo (CLAUDE.md > Modelo de datos > evidences).
// Sin límite de cantidad, sin catálogo. label y url son NOT NULL en la
// tabla, así que ambos son requeridos aquí (no hace falta optionalText/
// optionalUrl — sin campos opcionales no hay riesgo de doble-parseo).
export const evidenceEntrySchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1, "Ingresa una etiqueta.").max(100, "Máximo 100 caracteres."),
  url: z
    .string()
    .trim()
    .min(1, "Ingresa el enlace.")
    .max(300, "Enlace demasiado largo.")
    .regex(/^https?:\/\/.+/i, "Incluye el enlace completo (con https://)."),
});

export type EvidenceEntryInput = z.infer<typeof evidenceEntrySchema>;
