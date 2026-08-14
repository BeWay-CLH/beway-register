import "react";

// @react-email/render no pasa por la tabla de alias DOM de react-dom para
// estos atributos heredados (cellpadding/cellspacing/colspan/rowspan):
// se emiten literalmente con el nombre de la prop, así que usar la forma
// camelCase de React (cellPadding, colSpan...) produce HTML inválido
// (verificado renderizando WelcomeEmail con `npx email export` — el HTML
// resultante traía `cellPadding="0"` y `colSpan="3"` tal cual, atributos
// que ningún cliente de correo reconoce). Por eso todos los componentes en
// emails/components usan el nombre de atributo HTML real y minúscula
// (cellpadding, colspan...) en vez de la prop camelCase de React — esta
// augmentación solo restaura los tipos para esas dos formas.
declare module "react" {
  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    bgcolor?: string;
    colspan?: number;
    rowspan?: number;
  }

  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    bgcolor?: string;
    cellpadding?: number | string;
    cellspacing?: number | string;
  }
}
