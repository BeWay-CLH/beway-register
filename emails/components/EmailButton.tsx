import { BRAND, FONT_BODY } from "./constants";

type EmailButtonProps = {
  href: string;
  label: string;
  /** Primario cyan/texto oscuro (un solo primario por correo). Secundario
   * navy/texto blanco para la acción alternativa. */
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  paddingTop?: number;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// BeWay Design System > email-components.html > EM-Button. Celda con
// bgcolor + <a display:block> que ocupa toda la celda, más el fallback
// <v:roundrect> en comentario condicional MSO (Outlook de escritorio no
// soporta border-radius sin VML). El botón entero se genera como HTML
// literal porque los comentarios condicionales `<!--[if mso]>`/`<!--[if
// !mso]><!-->` no son expresables como JSX — solo el <td> contenedor
// (padding, posición en la tabla) es un elemento React real.
function buildButtonHtml({ href, label, variant, fullWidth }: Required<Pick<EmailButtonProps, "href" | "label" | "variant" | "fullWidth">>) {
  const bg = variant === "primary" ? BRAND.cyan : BRAND.navy;
  const color = variant === "primary" ? BRAND.dark : "#FFFFFF";
  const weight = variant === "primary" ? 700 : 600;
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);

  return `<table role="presentation" class="btn"${fullWidth ? ' width="100%"' : ""} cellpadding="0" cellspacing="0" border="0"><tr>
<td${fullWidth ? ' align="center"' : ""} bgcolor="${bg}" style="background-color:${bg};border-radius:8px;">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:46px;v-text-anchor:middle;width:240px;" arcsize="18%" fillcolor="${bg}" stroke="f">
<w:anchorlock/><center style="color:${color};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${safeLabel}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href="${safeHref}" style="display:block;padding:14px 30px;font-family:${FONT_BODY};font-size:16px;font-weight:${weight};color:${color};text-decoration:none;${fullWidth ? "text-align:center;" : ""}">${safeLabel}</a>
<!--<![endif]-->
</td>
</tr></table>`;
}

export function EmailButton({ href, label, variant = "primary", fullWidth = false, paddingTop = 28 }: EmailButtonProps) {
  return (
    <tr>
      <td
        className="gutter"
        style={{ padding: `${paddingTop}px 40px 0` }}
        dangerouslySetInnerHTML={{ __html: buildButtonHtml({ href, label, variant, fullWidth }) }}
      />
    </tr>
  );
}
