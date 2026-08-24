"use client";

import Script from "next/script";
import { useCallback, useId, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
        },
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

type RecaptchaProps = {
  onChange: (token: string | null) => void;
};

export const recaptchaSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

export function isRecaptchaConfigured() {
  return Boolean(recaptchaSiteKey);
}

export function Recaptcha({ onChange }: RecaptchaProps) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const tryRender = useCallback(() => {
    const el = document.getElementById(`recaptcha-${containerId}`);
    if (!el || !window.grecaptcha || widgetIdRef.current !== null) return;

    widgetIdRef.current = window.grecaptcha.render(el, {
      sitekey: recaptchaSiteKey,
      callback: (token) => onChangeRef.current(token),
      "expired-callback": () => onChangeRef.current(null),
      "error-callback": () => onChangeRef.current(null),
      theme: "light",
    });
  }, [containerId]);

  if (!recaptchaSiteKey) {
    return (
      <p className="recaptcha-missing" role="status">
        reCAPTCHA is not configured. Add{" "}
        <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and{" "}
        <code>RECAPTCHA_SECRET_KEY</code> (see <code>.env.example</code>).
      </p>
    );
  }

  return (
    <div className="recaptcha-wrap">
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          window.grecaptcha?.ready(tryRender);
        }}
      />
      <div id={`recaptcha-${containerId}`} />
    </div>
  );
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const res = await fetch("/api/verify-recaptcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}
