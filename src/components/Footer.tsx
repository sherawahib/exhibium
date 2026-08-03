import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  contactAddress,
  contactEmail,
  contactMailto,
  contactPhone,
  contactTel,
  navLinks,
  services,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot-glow" aria-hidden="true" />

      <div className="wrap foot-main">
        <div className="foot-brand-block">
          <BrandLogo className="foot-logo" onDark />
          <p>
            Exhibium Group is a multi-faceted consultancy providing branding, BIM
            management, and modular construction development solutions, with
            enhanced ROI-based solutions as our primary offering. Led by Fernando
            Williams across the United States, Latin America, and the Middle East.
          </p>
        </div>

        <div className="foot-cols">
          <nav className="foot-col" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="foot-col" aria-label="Practice groups">
            <h3>Practice groups</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`}>{s.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </nav>

          <div className="foot-col foot-contact">
            <h3>Contact</h3>
            <a className="foot-email" href={contactMailto}>
              {contactEmail}
            </a>
            <p className="foot-address">{contactAddress}</p>
            <a className="foot-phone" href={contactTel}>
              {contactPhone}
            </a>
            <div className="foot-thumb">
              <Image
                src="/boardroom.png"
                alt=""
                width={280}
                height={120}
                sizes="280px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="foot-bottom">
        <div className="wrap foot-bottom-row">
          <p>&copy; {year} Exhibium Group. All rights reserved.</p>
          <p className="foot-tagline">
            Branding · BIM · Modular · ROI Advisory
          </p>
          <a
            href="http://exhibium.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            exhibium.com
          </a>
        </div>
      </div>
    </footer>
  );
}
