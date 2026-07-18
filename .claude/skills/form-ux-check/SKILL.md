---
name: form-ux-check
description: Use whenever implementing or validating the registration form or the CV Vivo wizard for BeWay, to confirm the flow matches the approved customer journey and stage-by-stage UX.
---

# BeWay Form UX — Referencia y Checklist

## Flujo esperado

- **Paso 1 (cuenta)**: obligatorio, campos mínimos para no perder conversión (ver especificación de Pre-Registro).
- **Paso 2 (CV Vivo)**: opcional, completado por etapas independientes, con guardado y continuación, y barra de completitud visible.
- **Incentivo**: insignia especial de completitud visible para empresas al llegar al 100%.

## Checklist de validación

- [ ] ¿Cada etapa del CV Vivo se presenta como una pantalla independiente y corta (1-2 min), no como un formulario largo de una sola pieza?
- [ ] ¿El progreso se guarda por etapa, permitiendo al usuario cerrar y retomar exactamente donde quedó?
- [ ] ¿Existe un indicador visible de porcentaje de completitud?
- [ ] ¿Los campos repetibles (Experiencia, Proyectos, Formación complementaria) bloquean con un mensaje claro al llegar a 3 entradas, en vez de fallar silenciosamente?
- [ ] ¿Cada etapa incluye una línea breve explicando para qué se usará el dato solicitado?
- [ ] ¿La interfaz prioriza campos tipo tag/selección sobre texto libre extenso, pensando en uso desde celular?
- [ ] ¿Universidad y carrera aparecen pre-cargadas (no se piden de nuevo) en la etapa de Formación?
- [ ] ¿Se muestra o se referencia la insignia de completitud al alcanzar el 100%?
