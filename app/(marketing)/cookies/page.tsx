import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { CookiesContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = { title: "Política de Cookies — BeWay" };

export default function CookiesPage() {
  return (
    <LegalPageShell title="Política de Cookies">
      <CookiesContent />
    </LegalPageShell>
  );
}
