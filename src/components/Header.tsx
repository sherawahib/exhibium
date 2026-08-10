"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  contactEmail,
  contactMailto,
  contactPhone,
  contactTel,
  headerNavLinks,
} from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (!isHome) {
        setSolid(true);
        return;
      }
      setSolid(window.scrollY > 48);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`topbar${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
        <div className="topbar-utility">
          <div className="wrap topbar-utility-inner">
            <p>Exhibium Advisory Services</p>
            <div className="topbar-utility-links">
              <a href={contactTel}>{contactPhone}</a>
              <span aria-hidden="true">·</span>
              <a href={contactMailto}>{contactEmail}</a>
            </div>
          </div>
        </div>

        <div className="topbar-inner">
          <BrandLogo className="logo" priority onDark={!solid} />

          <nav className="topnav" aria-label="Primary">
            {headerNavLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={isActive(l.href) ? "is-active" : undefined}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
            <Link className="topnav-cta" href="/appointment">
              Book Appointment
            </Link>
          </nav>

          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className="drawer" id="drawer" hidden={!open}>
        <nav aria-label="Mobile">
          {headerNavLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={isActive(l.href) ? "is-active" : undefined}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link
            className="drawer-cta"
            href="/appointment"
            onClick={() => setOpen(false)}
          >
            Book Appointment
          </Link>
        </nav>
        <div className="drawer-meta">
          <a href={contactTel}>{contactPhone}</a>
          <a href={contactMailto}>{contactEmail}</a>
        </div>
      </aside>
    </>
  );
}
