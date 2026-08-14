# Estrategia de Correos — BeWay Pre-Registro

Referencia para implementar las plantillas y los mecanismos de envío con Resend. Cubre cuándo se envía cada correo, bajo qué condición, propuesta de contenido, y los lineamientos técnicos de HTML/CSS para que se vean bien en la mayor cantidad de clientes de correo posible (Outlook, Gmail, Apple Mail, clientes móviles).

## Las dos categorías

Esta línea divisoria sostiene el diseño de consentimiento separado ya definido en el proyecto (ver skill `gdpr-check`): el checkbox de términos es obligatorio, el de comunicaciones es opcional y revocable.

| Categoría | Se envía a | Base |
|---|---|---|
| **Transaccional** | Todos los usuarios, sin excepción | Necesario para prestar el servicio ya solicitado (cuenta, confirmación de CV completo, etc.) |
| **Comunicación / Nurture** | Solo quien marcó el checkbox de "comunicaciones" | Consentimiento de marketing |

La clasificación de cada correo abajo es de partida — conviene que la confirme el abogado junto con el resto de la revisión GDPR/LOPDGDD (ver `docs/pending-decisions.md`).

## Mapa de correos

| # | Correo | Disparador / condición | Categoría | Mecanismo |
|---|---|---|---|---|
| 1 | Verificación de cuenta | Inmediato al registrarse (Paso 1) | Transaccional | Evento (Supabase Auth) |
| 2 | Bienvenida a BeWay | Inmediato al verificar el correo | Transaccional | Evento |
| 3 | Recordatorio: no ha iniciado el CV Vivo | N días tras registro, sin ninguna etapa iniciada | Comunicación | Job programado |
| 4 | CV Vivo a medias — 1er aviso | N días de inactividad en el wizard, ≥1 etapa completada | Comunicación | Job programado |
| 5 | CV Vivo a medias — 2do y último aviso | N días de inactividad, si el 1er aviso no generó actividad | Comunicación | Job programado |
| 6 | ¡CV Vivo completo al 100%! + insignia | Inmediato al completar la última etapa | Transaccional | Evento |
| 7 | Actualización de avance de la plataforma | Cadencia periódica, broadcast | Comunicación | Envío manual/broadcast |
| 8 | Confirmación de exportación/eliminación de datos | Inmediato al usar esas funciones (Art. 15/17 RGPD) | Transaccional | Evento |
| 9 | Recuperación de contraseña | A solicitud del usuario | Transaccional | Evento (Supabase Auth) |

Los umbrales de días para #3, #4 y #5, y la cadencia de #7, están marcados como pendientes de confirmar con negocio — ver sección "Decisiones abiertas" al final de este documento.

Tras el 2do aviso sin respuesta (#5), el usuario deja de recibir recordatorios puntuales del wizard y pasa a la cadencia general de #7, para no agotar a alguien que no está interesado.

## Contenido propuesto por correo

**1. Verificación de cuenta**
- Asunto: "Confirma tu correo para activar tu cuenta en BeWay"
- Un solo CTA ("Confirmar mi correo"), sin distracciones.
- Nota de implementación: por defecto sale del flujo de Supabase Auth. Para tener el branding de BeWay, configurar SMTP custom de Supabase apuntando a Resend.

**2. Bienvenida**
- Asunto: "¡Bienvenido a BeWay, {{nombre}}! 🎉"
- Confirmación de cuenta activa + mensaje de ser de los primeros usuarios.
- 1-2 líneas del pitch de marca (pilares: conectamos talento, impulsamos innovación, generamos oportunidades, construimos el futuro).
- Invitación (no obligación) a llenar el CV Vivo, mencionando el incentivo de la insignia.
- CTA: "Comenzar mi CV Vivo".

**3. No ha iniciado el CV Vivo**
- Asunto: "Tu perfil profesional te está esperando"
- Reforzar el incentivo (insignia de fundador, visible para empresas).
- Bajar la fricción percibida: "Son etapas cortas, puedes hacerlo por partes."
- CTA directo a la primera etapa del wizard.

**4. CV Vivo a medias — 1er aviso**
- Asunto: "Vas a la mitad de tu CV Vivo, {{nombre}}"
- Mostrar el % real de avance (dato dinámico).
- Nombrar la etapa exacta donde quedó — nunca un CTA genérico al dashboard.
- CTA: "Continuar donde quedé", enlazando directo a esa etapa.

**5. CV Vivo a medias — 2do aviso**
- Asunto: "Última oportunidad para tu insignia de fundador"
- Tono más directo; mencionar que es el último recordatorio de este tipo (transparencia, no presión artificial).
- Recordar el valor concreto de la insignia ante las empresas.

**6. 100% completado**
- Asunto: "🏆 Tu CV Vivo está completo — ganaste tu insignia"
- Felicitación específica, no genérica.
- Explicar qué significa la insignia para las empresas.
- Qué sigue: fecha estimada de lanzamiento si existe, o "te avisaremos apenas lancemos".

**7. Actualización de avance de la plataforma**
- Asunto variable según el hito real (ej. "Ya tenemos X universidades piloto confirmadas").
- Contenido editorial, no relleno — solo hitos reales.
- Si el usuario no completó su CV Vivo, incluir un recordatorio suave al final, no como cuerpo principal.
- Debe incluir enlace de baja (unsubscribe) visible, ligado al consentimiento de marketing.

**8. Confirmación de exportación/eliminación de datos**
- Asunto: "Tu solicitud de [exportar tus datos / eliminar tu cuenta] fue procesada"
- Confirmación factual con fecha/hora. Si es eliminación, aclarar qué se borró y qué se retiene por obligación legal (si aplica).

**9. Recuperación de contraseña**
- Sale por defecto de Supabase Auth — mismo comentario que el correo #1 sobre personalizar vía SMTP custom con Resend.

## Mecanismos de envío

- **Eventos puntuales** (#1, #2, #6, #8, #9): se disparan directo desde la Server Action o el webhook de Supabase Auth correspondiente. Implementación directa, sin infraestructura adicional.
- **Basados en inactividad** (#3, #4, #5): no hay un evento que los dispare — requieren un job programado (Vercel Cron o una Edge Function de Supabase) que corra al menos diariamente, revise qué usuarios cruzaron el umbral de días sin actividad, y confirme que ese aviso específico no se envió ya (idempotencia: registrar en base de datos qué recordatorios ya se enviaron a cada usuario, para no duplicar).
- **Broadcast** (#7): envío manual o vía un job aparte, siempre filtrando solo por quienes tienen el consentimiento de marketing activo.

## Lineamientos de HTML/CSS para compatibilidad entre clientes de correo

Los clientes de correo (especialmente Outlook de escritorio, que renderiza con el motor de Word) no soportan flexbox, grid, ni la mayoría del CSS moderno. Reglas obligatorias para cualquier plantilla:

- **Layout con `<table>`, nunca flexbox/grid.** Cada bloque visual (header, sección, footer) es una tabla con `role="presentation"` y `cellpadding="0" cellspacing="0" border="0"`.
- **CSS inline en cada elemento**, no solo en un `<style>` en el `<head>`. Algunos clientes (Outlook, versiones de Gmail en ciertos contextos) ignoran o recortan el `<head>`. Un `<style>` en el head puede añadirse como refuerzo/para media queries, pero nunca como única fuente de estilos.
- **Ancho fijo del contenedor principal: 600px**, centrado con una tabla exterior al 100% y una interior de 600px. Es el estándar que se ve bien tanto en escritorio como, con una media query simple, en móvil.
- **Fuentes con fallback web-safe.** Space Grotesk e Inter (las tipografías de marca) no están garantizadas en todos los clientes de correo — usar `font-family: 'Inter', Arial, Helvetica, sans-serif;` con Arial/Helvetica como respaldo real, no solo declarativo.
- **Botones "a prueba de balas" (bulletproof buttons)**: un `<a>` con padding no se ve bien en Outlook. Usar una celda de tabla con `bgcolor` y el `<a>` ocupando toda la celda vía `display:block`, con comentarios condicionales `<!--[if mso]>...<![endif]-->` para el fallback VML en Outlook si el botón tiene esquinas redondeadas.
- **Imágenes**: siempre con `width` y `height` explícitos en el HTML (no solo en CSS), `alt` descriptivo, y hospedadas en una URL pública estable (no adjuntas). Evitar depender de imágenes de fondo (`background-image`) para contenido importante — Outlook no las soporta de forma confiable.
- **Nada de JavaScript.** Se elimina o se ignora en prácticamente todos los clientes.
- **Evitar `position`, `float`, `margin` negativo y shorthand de `background`** — soporte inconsistente. Usar `padding` en celdas de tabla en vez de `margin` en elementos de bloque para espaciado.
- **Modo oscuro**: al menos evitar texto negro puro sobre fondo transparente que Apple Mail/Outlook puedan invertir de forma extraña. Usar los tokens de marca (`brand-dark`, `brand-light`) explícitamente en vez de depender de "blanco/negro por defecto".

### Esqueleto de referencia (tabla + botón a prueba de balas)

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8FAFC;">
  <tr>
    <td align="center" style="padding:24px 0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;">
        <tr>
          <td style="padding:32px 40px; font-family:Inter,Arial,Helvetica,sans-serif; color:#0B132B; font-size:16px; line-height:1.5;">
            <!-- contenido del correo -->

            <!-- Botón a prueba de balas -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#00D4FF" style="border-radius:8px;">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{{cta_url}}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="15%" fillcolor="#00D4FF" stroke="f">
                  <center style="color:#0B132B;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Continuar mi CV Vivo</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="{{cta_url}}" style="display:block; padding:12px 24px; font-family:Arial,Helvetica,sans-serif; font-size:16px; font-weight:bold; color:#0B132B; text-decoration:none;">
                    Continuar mi CV Vivo
                  </a>
                  <!--<![endif]-->
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Herramienta recomendada: react-email

Dado que el stack ya usa React/TypeScript y Resend, **react-email** (`@react-email/components`, mantenido por el mismo equipo de Resend) es la opción más natural en vez de escribir HTML de correo a mano: expone componentes (`<Html>`, `<Body>`, `<Container>`, `<Section>`, `<Row>`, `<Column>`, `<Button>`, `<Text>`, `<Img>`) que compilan a HTML basado en tablas con estilos inline, siguiendo automáticamente la mayoría de las reglas de arriba. Reduce el riesgo de que alguien introduzca flexbox/grid por accidente en una plantilla nueva. Sigue siendo necesario revisar visualmente (ideal con una herramienta de preview multi-cliente) cualquier plantilla antes de darla por buena, especialmente el botón y el layout en Outlook.

## Decisiones abiertas

Estos puntos son de negocio, no técnicos — se recomienda añadirlos a `docs/pending-decisions.md`:

- Umbral exacto de días para el correo #3 (no ha iniciado el CV Vivo).
- Umbral exacto de días para los correos #4 y #5 (inactividad en el wizard).
- Cadencia exacta del correo #7 (actualización de avance).
- Confirmación con el abogado de la clasificación transaccional/comunicación de cada correo listado arriba.
