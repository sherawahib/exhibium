import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { AppointmentForm } from "@/components/AppointmentForm";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book a meeting with Exhibium Group for strategy, retail consulting, BIM, modular development, or market entry advisory.",
};

export default function AppointmentPage() {
  return (
    <>
      <PageBanner
        kicker="Schedule"
        title="Book an appointment"
        description="A short request for a meeting with the Exhibium team. Pick a time and we’ll follow up to confirm."
        image={pageImages.contact.src}
        imageAlt={pageImages.contact.alt}
      />
      <section className="appt-page">
        <div className="wrap appt-layout">
          <div className="appt-copy">
            <h2>Meet with Exhibium</h2>
            <p>
              Use this form for a focused consultation on branding, BIM, market
              entry and ROI advisory.
            </p>
            <ul className="appt-points">
              <li>Senior-level strategy discussion</li>
              <li>Confirmation by email after you submit</li>
            </ul>
          </div>
          <div className="appt-card">
            <AppointmentForm />
          </div>
        </div>
      </section>
    </>
  );
}
