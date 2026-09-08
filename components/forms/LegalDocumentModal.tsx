"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type LegalDocumentModalProps = {
  title: string;
  fullPageHref: string;
  onClose: () => void;
  children: ReactNode;
};

// Panel/modal de documento legal (BEWAY | Pre-Registro · Cambios UX + legal,
// sección "Comportamiento del modal"): en desktop, panel lateral scrollable;
// en móvil, pantalla completa. Cerrar vuelve exactamente al formulario de
// registro — este componente solo se abre/cierra, nunca navega, así que los
// campos ya escritos se conservan intactos. Portal a document.body: el Card
// del formulario tiene overflow-hidden y clipearía un modal renderizado
// dentro de su árbol.
export function LegalDocumentModal({ title, fullPageHref, onClose, children }: LegalDocumentModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end md:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
      />
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface-page shadow-lg md:h-auto md:max-h-full md:w-[480px] md:rounded-lg">
        <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-4">
          <h2 className="font-heading text-h3 text-text-heading">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-auto rounded-sm p-1 text-text-muted transition-colors duration-fast hover:bg-surface-sunken hover:text-text-body"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="border-t border-border-subtle px-6 py-3">
          <a
            href={fullPageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-small font-semibold text-link hover:text-link-hover hover:underline"
          >
            Abrir en una página completa ↗
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
