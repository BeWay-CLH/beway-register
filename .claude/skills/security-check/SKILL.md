---
name: security-check
description: Use whenever implementing or validating authentication, data access, rate limiting, or form submission logic for BeWay, to confirm the security requirements from the spec are actually met in code.
---

# BeWay Security — Referencia y Checklist

## Requisitos

- RLS activo en toda tabla de usuario; cada usuario solo lee/escribe sus propias filas.
- Rate limiting (Upstash) en el registro y en cada guardado de etapa del CV Vivo, por IP y por usuario, para mitigar DoS y abuso.
- Cloudflare Turnstile validado en el servidor antes de crear la cuenta — no basta con renderizar el widget en el cliente.
- Validación de datos siempre en el servidor (zod dentro de la Server Action); el cliente nunca es la única barrera.
- Consentimiento de términos y condiciones (obligatorio) y consentimiento de comunicaciones de marketing (opcional) como columnas/checkboxes independientes.
- La service role key de Supabase nunca se expone al cliente. Ningún dato personal viaja en query params o URLs.

## Checklist de validación

- [ ] ¿Cada Server Action que muta datos valida con zod antes de tocar la base de datos?
- [ ] ¿Existe rate limiting activo (y con una prueba que lo confirme) en `/registro` y en cada endpoint de guardado de etapa?
- [ ] ¿Turnstile se verifica server-side con la clave secreta, no solo se muestra el widget?
- [ ] ¿Los dos consentimientos (términos, marketing) están separados en la base de datos y en la UI?
- [ ] ¿Ningún secreto o clave de servicio aparece en código de cliente, en el bundle o en el repositorio?
- [ ] ¿Las políticas RLS se probaron intentando leer/escribir datos de otro usuario y fueron rechazadas?
