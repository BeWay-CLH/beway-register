import { z } from "zod";

// Consentimientos separados (CLAUDE.md > Seguridad): aceptar términos es
// obligatorio, marketing es opcional. Se reutiliza en cualquier schema de
// etapa que necesite pedirlos (hoy: registro).
export const consentsSchema = z.object({
  acceptedTerms: z.literal(true, {
    message: "Debes aceptar los términos y condiciones para continuar.",
  }),
  marketingConsent: z.boolean().default(false),
});

export type ConsentsInput = z.infer<typeof consentsSchema>;
