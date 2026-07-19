import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// Lee UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN del entorno.
const redis = Redis.fromEnv();

// CLAUDE.md > Seguridad: "Rate limiting (Upstash) en registro y en cada
// guardado de etapa: limitar por IP y por usuario para frenar DoS/abuso."
// Cada Server Action relevante debe llamar al limiter que aplique — por IP
// siempre (incluye usuarios no autenticados), por usuario cuando ya hay sesión.

export const ipRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "ratelimit:ip",
});

export const userRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "ratelimit:user",
});

// Server Actions no reciben el Request; la IP se lee de los headers
// reenviados por Vercel/el proxy.
export async function getRequestIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}
