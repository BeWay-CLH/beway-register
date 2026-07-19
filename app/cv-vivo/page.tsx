// Entrada al wizard del CV Vivo (Paso 2). Cada etapa (2-11 según CLAUDE.md)
// se agrega aquí como una sub-ruta propia, ej. app/cv-vivo/educacion/page.tsx.
export default function CvVivoPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-heading text-h1 text-brand-dark">Tu CV Vivo</h1>
      <p className="max-w-md font-body text-body text-brand-gray">
        Wizard por etapas — progressive profiling con guardar y continuar.
      </p>
    </main>
  );
}
