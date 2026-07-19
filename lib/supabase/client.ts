import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para Client Components.
// TODO: tipar con `<Database>` una vez existan migraciones y se corra
// `supabase gen types typescript`.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
