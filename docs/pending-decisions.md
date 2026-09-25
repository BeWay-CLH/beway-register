# Decisiones Pendientes — BeWay Pre-Registro

Documento vivo. El agente `planner` lo revisa antes de cada nueva planificación y añade una fila cada vez que surge una ambigüedad que no le corresponde resolver a él ni a los agentes `implementer`/`tester` (decisiones de negocio, legales o de producto). Marcar como "Resuelta" en vez de borrar la fila, para conservar el historial de por qué se decidió algo.

| # | Decisión pendiente | Contexto | Responsable | Estado |
|---|---|---|---|---|
| 1 | Plazo de retención de leads que no completan el registro o el CV Vivo | El RGPD exige un límite definido y justificado (Art. 5.1.e); no se puede conservar indefinidamente por defecto | Negocio + Legal | Pendiente |
| 2 | Redacción y certificación del texto legal de la Política de Privacidad y los Términos y Condiciones | El checkbox de aceptación ya está en el diseño; falta el contenido legal que debe enlazar | Abogado especialista en protección de datos (LOPDGDD) | Pendiente |
| 3 | Validación legal de que la implementación técnica cumple RGPD/LOPDGDD | Cubre consentimientos, derechos del interesado, retención, región de datos, etc. — ver skill `gdpr-check` | Abogado especialista en protección de datos | Pendiente |
| 4 | Revisión de DPA y subencargados de Resend y Cloudflare Turnstile | Confirmar si procesan datos fuera de la UE; si es así, se necesitan Cláusulas Contractuales Tipo (SCCs) | Legal | Pendiente |
| 5 | ¿Aplica gate de edad mínima antes de crear la cuenta? | España fija el consentimiento propio en 14 años (LOPDGDD); evaluar si el público objetivo podría incluir menores de esa edad | Negocio + Legal | Pendiente |
| 6 | Herramienta de analítica definitiva: Vercel Analytics vs. Plausible | Plausible es cookieless y evita el banner de consentimiento de cookies (LSSI-CE); Vercel Analytics podría requerirlo | Producto | Pendiente |
| 7 | Incentivo de completitud: diseño visual final de la insignia y su presentación en el perfil | Ya confirmado el concepto (insignia al 100% de completitud); falta el diseño visual | Producto + Diseño | Pendiente |
| 8 | DPIA (Evaluación de Impacto) para KYC académico y Beway Score | Se activará cuando se planifique esa fase futura — no es parte del alcance del pre-registro actual | Legal (cuando se planifique esa fase) | No urgente — anotado para más adelante |
| 9 | Dirección postal real de BeWay para el footer de los correos | CAN-SPAM/GDPR exigen una dirección física identificable en correos comerciales; el footer de `emails/components/Footer.tsx` usa un placeholder `[Dirección legal pendiente]` | Negocio | Pendiente |
| 10 | Umbrales de días para los correos #3/#4/#5 y cadencia de #7 | Ver docs/email-strategy.md > Decisiones abiertas — implementados como constantes nombradas en `lib/email/config.ts`, fáciles de ajustar sin tocar la lógica de envío | Negocio | Pendiente |
| 11 | `public/brand/logo-stacked-negative.png` y `logo-negative-inline-transparent.png` están truncados (falta el IDAT final y el chunk IEND) | Descubierto al generar el CV en PDF: `@react-pdf/renderer` los rechaza ("Incomplete or corrupt PNG file"); el navegador lo disimula vía `sharp`/next-image, así que hoy no se nota en la UI, pero es frágil. Solo `logo-icon-transparent.png` está íntegro | Diseño (regenerar/re-exportar los PNG) | Pendiente |

## Resueltas (historial)

| # | Decisión | Resolución |
|---|---|---|
| R1 | Incentivo por completar el CV Vivo | Insignia especial de "completitud 100%", visible para empresas |
| R2 | Reutilización de campos entre cuenta y CV Vivo | Universidad y carrera capturadas en el Paso 1 se pre-cargan en la Etapa 4; no se piden dos veces |
| R3 | Límite de entradas en campos repetibles | Máximo 3 por campo (Experiencia, Proyectos y Actividades, Formación Complementaria), modelado como 1:N para poder extenderse después sin migración |
| R4 | Visibilidad de perfil por defecto | `profile_visibility` pasa de `'companies_only'` a `'private'` (migración `20260907090000_legal_consent_versions.sql`), por requisito explícito de "BEWAY \| Pre-Registro · Cambios UX + legal" v3.0, sección 5: crear una cuenta no debe hacer nada visible para empresas |
| R5 | ¿Se mueven Universidad/Carrera del registro al CV Vivo? | El documento legal v3.0 lo recomienda ("no bloquear la creación de cuenta"), pero contradice R2 y es un cambio de schema/Server Action, no solo de copy — se mantienen obligatorias en el Paso 1 tal como están hoy |
| R6 | ¿Checkbox de edad mínima (18+) del documento legal v3.0? | No se añade todavía: está condicionado en el propio documento a que Producto+Legal aprueben esa política, y la decisión #5 de esta tabla sigue pendiente |
| R7 | Experiencia y Proyectos: ¿obligatorias u opcionales en el CV Vivo? | Feedback de negocio (sept. 2026): pasan a opcionales — `optional: true` en `lib/cv-vivo/stages.ts`. Vacías, se excluyen del denominador del % y de la insignia de 100%; si el usuario añade algo, cuentan igual que cualquier otra etapa |
| R8 | ¿"Mi CV" debe mostrar las descripciones largas completas o truncadas? | Feedback de negocio: completas siempre, sin `line-clamp`. Se agregó `description` a Educación y Experiencia en `app/cuenta/page.tsx`/`PerfilPanels.tsx` (antes no se mostraba en absoluto) y se quitó el `line-clamp-3` de Proyectos |
| R9 | ¿Cómo se genera el CV en PDF con marca BeWay? | Feedback de negocio: `@react-pdf/renderer`, plantilla en `lib/cv-pdf/`. Fuentes de marca embebidas como `data:` URL (un Buffer crudo falla en runtime pese a lo que sugiere la documentación); logo del header es `logo-icon-transparent.png` — ver decisión pendiente #11 sobre PNGs truncados |

## Nuevo desde "BEWAY | Pre-Registro · Cambios UX + legal" (v3.0, sept. 2026)

Implementado con los textos legales completos (Términos, Privacidad, Aviso Legal, Cookies, `/derechos`) usando los
placeholders `[RAZÓN SOCIAL]`, `[NIF]`, `[DOMICILIO]`, `[EMAIL PRIVACIDAD]`, `[FECHA]` tal como los trae el
documento — visibles a propósito (`grep -r "\[COMPLETAR\|RAZÓN SOCIAL\|NIF\]\|DOMICILIO\]\|EMAIL PRIVACIDAD\]" components/legal`)
hasta que Negocio/Legal los cierre. **No deben salir a producción con placeholders** — ver "Antes de publicar" en el
propio documento. Relacionado con la decisión #2 de arriba.
