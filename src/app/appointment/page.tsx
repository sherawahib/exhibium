import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { AppointmentForm } from "@/components/AppointmentForm";
import {
  contactAddress,
  contactEmail,
  contactMailto,
  contactPhone,
  contactTel,
  pageImages,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book a meeting with Exhibium Group for market entry, BIM advisory, modular construction, and ROI-led strategy.",
};

const assurances = [
  {
    num: "01",
    title: "Senior-level discussion",
    text: "Conversations are led with executive context, not generic sales scripts.",
  },
  {
    num: "02",
    title: "Clear next steps",
    text: "We confirm timing by email and outline the most useful agenda for your goals.",
  },
  {
    num: "03",
    title: "Focused advisory scope",
    text: "Market entry, BIM/VDC, modular delivery, and commercial performance.",
  },
] as const;

export default function AppointmentPage() {
  return (
    <>
      <PageBanner
        kicker="Schedule"
        title="Book an appointment"
        crumbLabel="Appointment"
        description="Request a focused consultation with Exhibium. Share your preferred time and we will follow up to confirm."
        image={pageImages.contact.src}
        imageAlt={pageImages.contact.alt}
      />

      <section className="appt-page">
        <div className="wrap appt-layout">
          <aside className="appt-copy">
            <p className="kicker appt-kicker">
              <span>Consultation</span>
            </p>
            <h2>Meet with Exhibium</h2>
            <p>
              Use this form for a senior advisory conversation on market entry,
              BIM management, modular construction, and ROI-led strategy.
            </p>

            <ul className="appt-assurances" aria-label="What to expect">
              {assurances.map((item) => (
                <li key={item.num}>
                  <span className="appt-assurance-num">{item.num}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="appt-contact-panel">
              <h3>Direct contact</h3>
              <div className="appt-contact-list">
                <a className="appt-contact-item" href={contactMailto}>
                  <span>Email</span>
                  <strong>{contactEmail}</strong>
                </a>
                <a className="appt-contact-item" href={contactTel}>
                  <span>Phone</span>
                  <strong>{contactPhone}</strong>
                </a>
                <div className="appt-contact-item">
                  <span>Office</span>
                  <strong>{contactAddress}</strong>
                </div>
              </div>
              <Link className="cta cta-text" href="/services">
                Review services first →
              </Link>
            </div>
          </aside>

          <div className="appt-card">
            <div className="appt-card-head">
              <p className="kicker">Request form</p>
              <h3>Tell us when to meet</h3>
              <p>
                Submit your preferred date and focus area. We will reply to
                confirm availability.
              </p>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </section>
    </>
  );
}
