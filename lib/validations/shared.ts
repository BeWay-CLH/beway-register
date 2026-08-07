import { z } from "zod";

// Texto opcional que se normaliza a null cuando está vacío. Acepta tanto un
// string (lo que manda el input real) como null (lo que ya produjo este
// mismo helper la primera vez) — cada Server Action de etapa valida con el
// mismo schema que ya usó el cliente vía zodResolver, y el cliente entrega
// la SALIDA ya transformada (string | null), no el string crudo. Sin el
// `.nullable()`, re-parsear ese null como z.string() falla siempre que el
// campo quedó vacío.
export function optionalText(max: number, message?: string) {
  return z
    .string()
    .trim()
    .max(max, message)
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null));
}

// Enlace opcional: mismo trato de vacío/null que optionalText, más
// validación de formato (debe incluir el protocolo). Se aplica sobre el
// valor YA normalizado, así que null pasa el refine sin tocar el regex.
export function optionalUrl(max: number, invalidMessage = "Incluye el enlace completo (con https://).") {
  return z
    .string()
    .trim()
    .max(max, "Enlace demasiado largo.")
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null))
    .refine((value) => value === null || /^https?:\/\/.+/i.test(value), { message: invalidMessage });
}
