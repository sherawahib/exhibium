"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/admin/overview", label: "Overview" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/forms", label: "Forms" },
  { href: "/admin/chat", label: "Live chat" },
] as const;

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-app">
      <aside className="admin-side">
        <div className="admin-brand">
          <span>Exhibium</span>
          <em>Admin Console</em>
        </div>
        <nav className="admin-nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href || pathname?.startsWith(`${l.href}/`)
                  ? "is-active"
                  : undefined
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={logout}>
          Sign out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <h1>{title}</h1>
          <a href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
