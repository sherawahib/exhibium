"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "exhibium_vid";
const EMAIL_KEY = "exhibium_visitor_email";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    const visitorId = raw ? Number(raw) : undefined;
    const email = localStorage.getItem(EMAIL_KEY) || undefined;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname || "/", visitorId, email }),
    })
      .then((r) => r.json())
      .then((data: { id?: number; email?: string | null }) => {
        if (data.id) localStorage.setItem(STORAGE_KEY, String(data.id));
        if (data.email) localStorage.setItem(EMAIL_KEY, data.email);
      })
      .catch(() => undefined);
  }, [pathname]);

  return null;
}
