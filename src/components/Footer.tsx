import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { contactEmail, contactMailto, navLinks, services } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot-glow" aria-hidden="true" />

      <div className="wrap foot-main">
        <div className="foot-brand-block">
          <BrandLogo className="foot-logo" onDark />
          <p>
            Exhibium Group is a multi-faceted consultancy providing Branding, BIM
            management services, and Modular Construction development
            solutions—with enhanced ROI-based solutions as the primary offering.
            Led by Fernando Williams across the United States, Latin America, and
            the Middle East.
          </p>
          <div className="foot-badges">
            <span>Branding</span>
            <span>Process Management</span>
            <span>Development Projects</span>
            <span>Strategy and Execution</span>
            <span>Market Entry Services</span>
            <span>ROI Advisory Services</span>
          </div>
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
                  <Link href={`/services/${s.slug}`}>{s.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </nav>

          <div className="foot-col foot-contact">
            <h3>Book Appointment</h3>
            <a className="foot-email" href={contactMailto}>
              {contactEmail}
            </a>
            <p>
              United States · Latin America · Middle East
            </p>
            <Link className="foot-cta" href="/appointment">
              Book Appointment
            </Link>
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
