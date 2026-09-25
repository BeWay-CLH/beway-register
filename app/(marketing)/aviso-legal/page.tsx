import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { AvisoLegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = { title: "Aviso Legal — BeWay" };

export default function AvisoLegalPage() {
  return (
    <LegalPageShell title="Aviso Legal">
      <AvisoLegalContent />
    </LegalPageShell>
  );
}
