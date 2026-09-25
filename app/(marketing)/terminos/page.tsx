import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { TerminosContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = { title: "Términos de Uso — BeWay" };

export default function TerminosPage() {
  return (
    <LegalPageShell title="Términos de Uso del Pre-Registro">
      <TerminosContent />
    </LegalPageShell>
  );
}
