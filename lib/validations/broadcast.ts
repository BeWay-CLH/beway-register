import { z } from "zod";

// Payload del envío manual de #7 (docs/email-strategy.md) — ver
// app/api/admin/send-broadcast/route.ts. reminderText y unsubscribeUrl no
// van acá: se calculan por destinatario (lib/email/broadcast.ts), nunca
// se piden en la solicitud.
export const broadcastSchema = z.object({
  subject: z.string().trim().min(1, "El asunto es obligatorio."),
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().min(1, "El título es obligatorio."),
  bodyParagraphs: z.array(z.string().trim().min(1)).min(1, "Incluye al menos un párrafo."),
  image: z
    .object({
      src: z.string().url(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive(),
      alt: z.string().trim().min(1, "La imagen necesita un alt descriptivo."),
      caption: z.string().trim().optional(),
    })
    .optional(),
  stats: z
    .tuple([
      z.object({ value: z.string().trim().min(1), label: z.string().trim().min(1) }),
      z.object({ value: z.string().trim().min(1), label: z.string().trim().min(1) }),
    ])
    .optional(),
  ctaUrl: z.string().url(),
  ctaLabel: z.string().trim().min(1, "El botón necesita un texto."),
  dedupeKey: z.string().trim().min(1, "dedupeKey es obligatorio — identifica este envío puntual."),
});

export type BroadcastInput = z.infer<typeof broadcastSchema>;
