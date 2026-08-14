import { BRAND, FONT_BODY } from "./constants";

// BeWay Design System > email-components.html > EM-Fallback. Bajo todo
// botón cuya acción sea crítica (#1 verificación, #9 contraseña): si el
// cliente bloquea el botón, la URL en texto plano es la salida.
export function Fallback({ url }: { url: string }) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "16px 40px 0" }}>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.6, color: BRAND.gray, wordBreak: "break-all" }}>
          Si el botón no funciona, copia este enlace en tu navegador:
          <br />
          <a href={url} style={{ color: BRAND.cyanDark, textDecoration: "underline" }}>
            {url}
          </a>
        </p>
      </td>
    </tr>
  );
}
