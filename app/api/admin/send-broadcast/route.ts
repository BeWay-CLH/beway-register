import { NextResponse, type NextRequest } from "next/server";
import { broadcastSchema } from "@/lib/validations/broadcast";
import { sendPlatformUpdateBroadcast } from "@/lib/email/broadcast";

// Envío manual del correo #7 (docs/email-strategy.md > "Actualización de
// avance de la plataforma"). A propósito NO es un cron ni un botón en la
// UI — cada hito real (ej. "ya tenemos X universidades piloto") lo
// dispara alguien del equipo con acceso a ADMIN_API_SECRET, describiendo
// el contenido en el body. Protegido igual que el cron de recordatorios:
// un secreto de servidor por Authorization Bearer, no sesión de usuario
// (no hay panel de administración en este proyecto).
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = broadcastSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const result = await sendPlatformUpdateBroadcast(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[api/admin/send-broadcast] error:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
