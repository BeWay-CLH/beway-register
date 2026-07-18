---
name: gdpr-check
description: Use whenever implementing or validating anything that touches personal data for BeWay — registration, consent, data storage region, retention, account deletion/export, cookies/analytics, or third-party processors — to check technical alignment with GDPR/LOPDGDD principles. This is a functional/technical checklist, not a legal certification.
---

# BeWay GDPR / LOPDGDD — Referencia y Checklist

**Importante:** este skill es una guía técnica de ingeniería, no asesoría legal. El cumplimiento final del RGPD y de la LOPDGDD (España) requiere validación de un abogado especializado en protección de datos, incluyendo la redacción de la Política de Privacidad y los Términos y Condiciones. Este checklist existe para que esa revisión legal tenga una implementación concreta sobre la cual pronunciarse — no la sustituye.

## Principios que el código debe soportar

- **Consentimiento específico y no empaquetado**: aceptar términos (obligatorio) y aceptar comunicaciones de marketing (opcional) son consentimientos separados, nunca un solo checkbox.
- **Información en el momento de la captura (Art. 13 RGPD)**: el formulario debe enlazar a una Política de Privacidad real (no solo un checkbox) que explique responsable del tratamiento, finalidad, base jurídica, plazo de conservación y que los datos del CV Vivo se comparten con empresas.
- **Derechos del interesado (Art. 15-21)**: deben existir mecanismos técnicos, aunque sean simples, para:
  - Exportar los propios datos (portabilidad) — endpoint o botón que genere un export (ej. JSON/CSV) de los datos del usuario.
  - Eliminar la cuenta y los datos asociados (derecho al olvido) — borrado real o anonimización, no un simple flag de "inactivo".
  - Solicitar rectificación — como mínimo, que el usuario pueda editar sus propios datos desde su perfil.
- **Minimización y limitación de finalidad**: no capturar ni almacenar más datos de los necesarios para el propósito declarado (leads + CV Vivo opcional).
- **Retención definida (Art. 5.1.e)**: debe existir una política de cuánto tiempo se conservan los leads que nunca completan el registro o el CV Vivo, y un mecanismo (job programado o política documentada) que la haga cumplir. **Esta duración es una decisión de negocio/legal, no técnica — no inventar un plazo sin confirmarlo.**
- **Ubicación de los datos / transferencias internacionales**:
  - Proyecto de Supabase en región UE (ej. Frankfurt), no EE.UU.
  - Upstash Redis en región UE.
  - Revisar el DPA (Data Processing Addendum) y la lista de subencargados de Resend y Cloudflare Turnstile; si procesan datos fuera de la UE, se necesitan Cláusulas Contractuales Tipo (SCCs).
  - Funciones de Vercel apuntando a región Europa cuando sea configurable.
- **Cookies / ePrivacy (LSSI-CE en España)**: si se usa analítica con cookies no esenciales, se requiere banner de consentimiento de cookies. Preferir una solución cookieless (ej. Plausible) para evitar esta obligación cuando sea posible.
- **Edad mínima de consentimiento**: España fija la edad en 14 años (LOPDGDD). Si el producto pudiera recibir usuarios menores a esa edad, se necesita un gate de edad explícito antes de crear la cuenta.
- **Categorías de datos sensibles a futuro**: el KYC académico (escaneo de carnet) y el Beway Score (posible perfilado/decisión automatizada, Art. 22) no están en el alcance del pre-registro actual, pero cuando se planifiquen requerirán evaluar una DPIA (Art. 35). Dejar anotado, no implementar todavía.

## Checklist de validación

- [ ] ¿El checkbox de términos y el de marketing son controles independientes, ambos registrados por separado en base de datos?
- [ ] ¿Existe un enlace a una Política de Privacidad real desde el formulario de registro (aunque el texto final lo redacte el abogado)?
- [ ] ¿Hay un mecanismo (endpoint, botón en el perfil) para que el usuario exporte sus propios datos?
- [ ] ¿Hay un mecanismo para que el usuario elimine su cuenta, con borrado real o anonimización de sus datos?
- [ ] ¿El usuario puede editar/rectificar sus propios datos ya capturados?
- [ ] ¿El proyecto de Supabase y la instancia de Upstash están configurados en región UE?
- [ ] ¿Se revisó el DPA/subencargados de Resend y Turnstile respecto a transferencias fuera de la UE?
- [ ] ¿Existe una política de retención definida (aunque sea un valor a confirmar con el negocio) y algo que la haga cumplir, en vez de conservar leads indefinidamente?
- [ ] ¿La solución de analítica elegida es cookieless, o existe banner de consentimiento de cookies si no lo es?
- [ ] ¿Se consideró si el producto necesita gate de edad mínima (14 años en España)?
- [ ] ¿Quedó documentado (no implementado aún) que KYC académico y Beway Score requerirán una DPIA antes de construirse?
