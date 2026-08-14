import { Fragment, type ReactNode } from "react";
import { BRAND, FONT_BODY, FONT_DISPLAY } from "./constants";

export type StepItem = { title: string; body: ReactNode };

type StepsProps = {
  steps: StepItem[];
  paddingTop?: number;
};

// BeWay Design System > email-components.html > EM-Steps. Contador
// cuadrado navy — Outlook cuadra border-radius:50% de todos modos, así
// que el cuadrado es la forma honesta, no un círculo fallido.
export function Steps({ steps, paddingTop = 28 }: StepsProps) {
  return (
    <tr>
      <td className="gutter" style={{ padding: `${paddingTop}px 40px 0` }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            {steps.map((step, index) => (
              <Fragment key={step.title}>
                <tr>
                  <td
                    width={36}
                    bgcolor={BRAND.navy}
                    align="center"
                    valign="middle"
                    height={36}
                    style={{
                      backgroundColor: BRAND.navy,
                      width: 36,
                      height: 36,
                      fontFamily: FONT_DISPLAY,
                      fontSize: 15,
                      fontWeight: 700,
                      color: BRAND.cyan,
                    }}
                  >
                    {index + 1}
                  </td>
                  <td width={16} style={{ width: 16, fontSize: 0 }}>
                    &nbsp;
                  </td>
                  <td valign="middle" style={{ fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.5, color: BRAND.dark }}>
                    <b style={{ fontWeight: 600 }}>{step.title}</b> {step.body}
                  </td>
                </tr>
                {index < steps.length - 1 && (
                  <tr>
                    <td colspan={3} height={14} style={{ height: 14, lineHeight: "14px", fontSize: 0 }}>
                      &nbsp;
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
