import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCvPdfData } from "@/lib/cv-pdf/get-cv-pdf-data";
import { renderCvPdf } from "@/lib/cv-pdf/render";

// Generar el CV en PDF de un usuario a pedido de una empresa (feedback de
// negocio, sept. 2026): staff-only, mismo patrón de auth que
// send-broadcast — un secreto de servidor por Authorization Bearer, no
// sesión de usuario (no hay panel de administración en este proyecto).
// A diferencia de exportCvPdf (Server Action del propio usuario, donde su
// contacto siempre va completo), acá el destinatario es un tercero: se
// respeta lo que el usuario configuró en Privacidad (etapa 11,
// privacy_settings.show_contact_email/show_contact_phone).
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("id, full_name").eq("email", email).maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [data, { data: privacy }] = await Promise.all([
    getCvPdfData(admin, profile.id),
    admin
      .from("privacy_settings")
      .select("show_contact_email, show_contact_phone")
      .eq("profile_id", profile.id)
      .maybeSingle(),
  ]);

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const scopedData = {
    ...data,
    email: privacy?.show_contact_email ? data.email : null,
    phone: privacy?.show_contact_phone ? data.phone : null,
  };

  const pdfBuffer = await renderCvPdf(scopedData);

  return new NextResponse(new Blob([new Uint8Array(pdfBuffer)]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cv-beway-${profile.id}.pdf"`,
    },
  });
}
