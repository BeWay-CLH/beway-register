import { Loader2 } from "lucide-react";

// Next.js muestra esto automáticamente durante cualquier navegación o
// router.refresh() dentro de /cv-vivo/** mientras el Server Component se
// vuelve a renderizar — cierra el hueco entre que un botón de "Guardar"
// vuelve a su estado normal y la página realmente termina de actualizarse
// (CLAUDE.md > Stack: región UE, así que ese hueco es más notorio para
// usuarios fuera de Europa).
export default function CvVivoLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="animate-spin text-brand-cyan" size={32} />
    </div>
  );
}
