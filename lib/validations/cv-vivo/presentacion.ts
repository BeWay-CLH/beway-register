import { z } from "zod";

// Etapa 3 — presentación (CLAUDE.md > Modelo de datos > profiles). El
// titular es el campo que define si la etapa cuenta como completa (ver
// lib/cv-vivo/stages.ts); la bio es opcional.
export const presentacionSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, "Escribe un titular breve.")
    .max(120, "Máximo 120 caracteres."),
  bio: z
    .string()
    .trim()
    .max(600, "Máximo 600 caracteres.")
    .transform((value) => (value.length > 0 ? value : null)),
});

export type PresentacionInput = z.infer<typeof presentacionSchema>;
