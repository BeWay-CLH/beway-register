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

## Resueltas (historial)

| # | Decisión | Resolución |
|---|---|---|
| R1 | Incentivo por completar el CV Vivo | Insignia especial de "completitud 100%", visible para empresas |
| R2 | Reutilización de campos entre cuenta y CV Vivo | Universidad y carrera capturadas en el Paso 1 se pre-cargan en la Etapa 4; no se piden dos veces |
| R3 | Límite de entradas en campos repetibles | Máximo 3 por campo (Experiencia, Proyectos y Actividades, Formación Complementaria), modelado como 1:N para poder extenderse después sin migración |
