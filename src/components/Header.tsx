"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { contactPhone, contactTel, headerNavLinks } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 12);
      if (!isHome) {
        setSolid(true);
        return;
      }
      setSolid(y > window.innerHeight * 0.45);
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
      <header
        className={`topbar${solid ? " is-solid" : ""}${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
      >
        <div className="topbar-inner">
          <BrandLogo className="logo" priority onDark={!solid} />

          <nav className="topnav" aria-label="Primary">
            <div className="topnav-links">
              {headerNavLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={isActive(l.href) ? "is-active" : undefined}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
            <Link className="topnav-cta" href="/appointment">
              <span>Book Appointment</span>
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
          {headerNavLinks.map((l, index) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={isActive(l.href) ? "is-active" : undefined}
              aria-current={isActive(l.href) ? "page" : undefined}
              style={{ ["--i" as string]: index }}
            >
              <span className="drawer-num">0{index + 1}</span>
              <span className="drawer-label">{l.label}</span>
            </Link>
          ))}
          <Link
            className="drawer-cta"
            href="/appointment"
            onClick={() => setOpen(false)}
            style={{ ["--i" as string]: headerNavLinks.length }}
          >
            Book Appointment
          </Link>
        </nav>
        <div className="drawer-meta">
          <a href={contactTel}>{contactPhone}</a>
          <p>Exhibium Advisory Services</p>
        </div>
      </aside>
    </>
  );
}
