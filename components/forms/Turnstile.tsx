"use client";

import Script from "next/script";
import { useId, useRef } from "react";

type TurnstileWidgetOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileWidgetOptions) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
};

// Widget anti-bot de Cloudflare Turnstile. Renderizado explícito (no el modo
// implícito por data-attributes) porque el token debe llegar a react-hook-form
// vía onVerify, no a un input oculto de un submit nativo. La verificación real
// del token pasa siempre en el servidor (ver lib/turnstile.ts) antes de crear
// la cuenta — este componente solo obtiene el token.
export function Turnstile({ onVerify, onExpire, onError }: TurnstileProps) {
  const containerId = useId();
  const widgetIdRef = useRef<string | null>(null);

  function renderWidget() {
    const container = document.getElementById(containerId);
    if (!container || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      callback: onVerify,
      "expired-callback": onExpire,
      "error-callback": onError,
    });
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div id={containerId} />
    </>
  );
}
