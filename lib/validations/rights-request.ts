import { z } from "zod";
import { optionalText } from "@/lib/validations/shared";

// Página pública "/derechos" (BEWAY | Pre-Registro · Cambios UX + legal,
// sección "5. Página «Ejercer mis derechos»"). Sin adjunto: el documento lo
// marca como "solo si es necesario" — añadir carga de archivos implicaría
// un bucket de Storage y políticas propias para un caso que hoy no es el
// camino principal; se retoma si en la práctica hace falta.
export const rightsRequestSchema = z.object({
  requestType: z.enum(
    [
      "access",
      "rectification",
      "erasure",
      "limitation",
      "objection",
      "portability",
      "consent_withdrawal",
      "other",
    ],
    { message: "Selecciona el tipo de solicitud." },
  ),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
  details: optionalText(2000, "Máximo 2000 caracteres."),
});

export type RightsRequestInput = z.infer<typeof rightsRequestSchema>;

export const REQUEST_TYPE_OPTIONS: { value: RightsRequestInput["requestType"]; label: string }[] = [
  { value: "access", label: "Acceso" },
  { value: "rectification", label: "Rectificación" },
  { value: "erasure", label: "Supresión" },
  { value: "limitation", label: "Limitación" },
  { value: "objection", label: "Oposición" },
  { value: "portability", label: "Portabilidad" },
  { value: "consent_withdrawal", label: "Retirada de consentimiento" },
  { value: "other", label: "Otra consulta" },
];
