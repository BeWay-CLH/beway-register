import { z } from "zod";
import { optionalText, optionalUrl } from "@/lib/validations/shared";

// Etapa 8 — una certificación/curso (CLAUDE.md > Modelo de datos >
// certifications). Máx. 3 por perfil, igual que experiences/projects. Solo
// una fecha (issue_date) — no hay rango ni is_current.
export const certificationEntrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Ingresa el nombre del curso o certificación.").max(150, "Máximo 150 caracteres."),
  certificationTypeId: z.coerce.number().int().positive("Selecciona el tipo."),
  institution: optionalText(150, "Máximo 150 caracteres."),
  issueDate: optionalText(20),
  credentialUrl: optionalUrl(300),
});

export type CertificationEntryInput = z.infer<typeof certificationEntrySchema>;
