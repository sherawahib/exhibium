"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "exhibium_vid";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    const visitorId = raw ? Number(raw) : undefined;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname || "/", visitorId }),
    })
      .then((r) => r.json())
      .then((data: { id?: number }) => {
        if (data.id) localStorage.setItem(STORAGE_KEY, String(data.id));
      })
      .catch(() => undefined);
  }, [pathname]);

  return null;
}
