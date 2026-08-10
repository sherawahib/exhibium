import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import {
  pageImages,
  contactAddress,
  contactEmail,
  contactMailto,
  contactPhone,
  contactTel,
  services,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Exhibium Group for market entry, BIM oversight, modular development, or branding advisory. Email fwilliams@exhibium.com.",
};

export default function ContactPage() {
  return (
    <>
      <PageBanner
        kicker="Engage"
        title="Contact the firm"
        description="Direct access to senior advisory for your next market move."
        image={pageImages.contact.src}
        imageAlt={pageImages.contact.alt}
      />
      <section className="contact-page">
        <div className="wrap contact-advance">
          <div className="contact-advance-main">
            <p className="kicker">Start here</p>
            <h2>Tell us where you are expanding.</h2>
            <p className="contact-advance-lede">
              Market entry, BIM/VDC oversight, or modular pathways — we respond
              with senior attention and a clear next step.
            </p>

            <div className="contact-channels">
              <a className="contact-channel" href={contactMailto}>
                <span>Email</span>
                <strong>{contactEmail}</strong>
              </a>
              <a className="contact-channel" href={contactTel}>
                <span>Phone</span>
                <strong>{contactPhone}</strong>
              </a>
              <div className="contact-channel">
                <span>Office</span>
                <strong>{contactAddress}</strong>
              </div>
            </div>

            <div className="contact-advance-actions">
              <Link className="cta cta-ink" href="/appointment">
                Book Appointment
              </Link>
              <a className="cta cta-text" href={contactMailto}>
                Email Fernando →
              </a>
            </div>
          </div>

          <aside className="contact-advance-side">
            <p className="kicker">Practice focus</p>
            <ul className="contact-practice-list">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`}>
                    <em>{s.num}</em>
                    <span>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="contact-side-note">
              Domain ·{" "}
              <a
                href="http://exhibium.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                exhibium.com
              </a>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
