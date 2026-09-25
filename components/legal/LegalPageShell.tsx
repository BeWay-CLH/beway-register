import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/layout/Footer";

// Layout compartido de las 5 páginas legales (/terminos, /privacidad,
// /aviso-legal, /cookies, /derechos): header mínimo con logo + volver,
// contenido a ancho de lectura (760px, no los 1200px de la landing), y el
// mismo Footer del resto del sitio.
export function LegalPageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border-subtle bg-surface-page">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-4 px-6">
          <Link href="/" aria-label="Ir al inicio">
            <Logo height={28} />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 font-body text-small text-text-muted hover:text-text-body hover:underline"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-surface-page py-12 md:py-16">
        <div className="mx-auto max-w-[760px] px-6">
          <h1 className="font-heading text-h1 text-text-heading">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
