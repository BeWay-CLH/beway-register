const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Valida el token de Turnstile en el servidor. Debe llamarse siempre antes de
// crear la cuenta (CLAUDE.md > Seguridad) — nunca confiar en que el widget del
// cliente haya pasado el reto.
export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const result = (await response.json()) as { success: boolean; "error-codes"?: string[] };
  return result.success;
}
