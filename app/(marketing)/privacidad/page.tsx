import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { PrivacidadContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = { title: "Política de Privacidad — BeWay" };

export default function PrivacidadPage() {
  return (
    <LegalPageShell title="Política de Privacidad del Pre-Registro">
      <PrivacidadContent />
    </LegalPageShell>
  );
}
