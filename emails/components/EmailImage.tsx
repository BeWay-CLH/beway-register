import { BRAND, FONT_BODY } from "./constants";

type EmailImageProps = {
  src: string;
  width?: number;
  height: number;
  alt: string;
  caption?: string;
};

// BeWay Design System > email-components.html > EM-Image. Ancho útil de
// 520px, width/height en atributos HTML (no solo CSS) + max-width:100%
// para móvil. alt siempre redactado como frase útil: muchos clientes
// bloquean imágenes por defecto.
export function EmailImage({ src, width = 520, height, alt, caption }: EmailImageProps) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "24px 40px" }}>
        <img
          src={src}
          width={width}
          height={height}
          alt={alt}
          style={{ display: "block", border: 0, outline: "none", textDecoration: "none", width, maxWidth: "100%", height: "auto" }}
        />
        {caption && <p style={{ margin: "10px 0 0", fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.5, color: BRAND.gray }}>{caption}</p>}
      </td>
    </tr>
  );
}
