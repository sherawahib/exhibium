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
      <div className="foot-cta-band">
        <div className="wrap foot-cta-inner">
          <div className="foot-cta-copy">
            <p className="foot-cta-kicker">Next engagement</p>
            <h2>Ready for senior advisory on your next market move?</h2>
          </div>
          <div className="foot-cta-actions">
            <Link className="foot-cta-primary" href="/appointment">
              Book Appointment
            </Link>
            <a className="foot-cta-secondary" href={contactMailto}>
              Email the firm
            </a>
          </div>
        </div>
      </div>

      <div className="wrap foot-main">
        <div className="foot-brand-block">
          <BrandLogo className="foot-logo" onDark />
          <p className="foot-lead">
            Market entry, BIM/VDC, and modular advisory for A/E/C firms,
            developers, and investors — led by Fernando Williams across the
            Americas and the Middle East.
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
            <h3>Practices</h3>
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
            <div className="foot-contact-list">
              <a className="foot-contact-item" href={contactMailto}>
                <span className="foot-contact-label">Email</span>
                <span className="foot-contact-value">{contactEmail}</span>
              </a>
              <a className="foot-contact-item" href={contactTel}>
                <span className="foot-contact-label">Phone</span>
                <span className="foot-contact-value">{contactPhone}</span>
              </a>
              <div className="foot-contact-item">
                <span className="foot-contact-label">Office</span>
                <span className="foot-contact-value">{contactAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="foot-bottom">
        <div className="wrap foot-bottom-row">
          <p>&copy; {year} Exhibium Group. All rights reserved.</p>
          <p className="foot-tagline">
            Market Entry · BIM · Modular · ROI Advisory
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
