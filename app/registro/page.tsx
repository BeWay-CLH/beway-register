export default function RegistroPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-heading text-h1 text-brand-dark">Crea tu cuenta</h1>
      <p className="max-w-md font-body text-body text-brand-gray">
        Paso 1 del pre-registro. El formulario (react-hook-form + zod +
        Turnstile) vive aquí.
      </p>
    </main>
  );
}
