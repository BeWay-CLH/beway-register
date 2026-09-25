import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GENERAL_CONTACT_EMAIL } from "@/lib/legal/constants";

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
  { href: "/derechos", label: "Ejercer mis derechos" },
];

// Footer compartido (BEWAY | Pre-Registro · Cambios UX + legal, secciones 4
// y 6): "Solo en el footer de landing, registro y login" para Aviso Legal, y
// enlaces legales completos en los tres. Antes vivía duplicado/incompleto
// solo en la landing (app/(marketing)/page.tsx) — ahora es un único
// componente reutilizado en los tres puntos de entrada públicos.
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6">
        <Logo height={28} />
        <div className="flex w-full flex-col items-center gap-4 border-t border-border-inverse pt-6 font-body text-small text-text-on-inverse-muted md:flex-row md:justify-between">
          <p>© {year} BeWay. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white hover:underline">
                {link.label}
              </Link>
            ))}
            <a href={`mailto:${GENERAL_CONTACT_EMAIL}`} className="hover:text-white hover:underline">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
