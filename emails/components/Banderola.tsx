import { BRAND } from "./constants";

// BeWay Design System > ui_kits/email/email-components.html > EM-Banderola.
// Cinta de 4px con el degradado de marca en background-image + bgcolor
// navy sólido como fallback: Outlook ignora el degradado y muestra el
// navy, que sigue siendo correcto de marca. Siempre la misma franja de
// 4px en los 9 correos (email-base.html no usa la variante de etiqueta).
export function Banderola() {
  return (
    <tr>
      <td
        bgcolor={BRAND.navy}
        height={4}
        style={{
          backgroundColor: BRAND.navy,
          backgroundImage: "linear-gradient(90deg,#0A8FA8 0%,#1C2541 45%,#0B132B 100%)",
          height: 4,
          lineHeight: "4px",
          fontSize: 0,
        }}
      >
        &nbsp;
      </td>
    </tr>
  );
}
