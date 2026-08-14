import type { ReactNode } from "react";
import { Html, Head, Preview, Body } from "@react-email/components";
import { BRAND } from "./constants";

type EmailShellProps = {
  preview: string;
  children: ReactNode;
};

// BeWay Design System > ui_kits/email/email-base.html > EM-Shell. Tabla
// exterior 100% sobre el lienzo (#F8FAFC) + tabla interior de 600px sobre
// blanco — ningún bloque hijo define su propio ancho. El <style> del head
// es refuerzo (media query móvil), nunca la única fuente de estilos: todo
// lo crítico va inline en cada bloque (ver el resto de emails/components).
// <Preview> resuelve el preheader oculto sin reescribir a mano el truco
// display:none/max-height:0 del esqueleto de referencia. La tabla
// exterior 100% ya la da <Body> (@react-email/body) automáticamente —
// centra su <td> con el `style` que se le pasa acá, así que no hace falta
// duplicarla a mano; solo se declara la tabla interior de 600px.
export function EmailShell({ preview, children }: EmailShellProps) {
  return (
    <Html lang="es">
      <Head>
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
          table{border-collapse:collapse}
          img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
          a{color:${BRAND.cyanDark}}
          @media only screen and (max-width:620px){
            .container{width:100%!important}
            .gutter{padding-left:24px!important;padding-right:24px!important}
            .h1{font-size:24px!important;line-height:1.25!important}
            .col-stack{display:block!important;width:100%!important;box-sizing:border-box}
            .col-gutter{height:14px!important;line-height:14px!important;width:auto!important}
            .btn a{display:block!important;text-align:center!important}
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BRAND.light, padding: "24px 12px", textAlign: "center" }}>
        <table
          role="presentation"
          className="container"
          width={600}
          cellpadding={0}
          cellspacing={0}
          border={0}
          bgcolor="#FFFFFF"
          align="center"
          style={{ width: 600, backgroundColor: "#FFFFFF", textAlign: "left" }}
        >
          <tbody>{children}</tbody>
        </table>
      </Body>
    </Html>
  );
}
