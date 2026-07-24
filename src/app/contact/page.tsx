import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/PageBanner";
import { pageImages, contactEmail, contactMailto } from "@/lib/site";

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
        title="Contact"
        description="Start a conversation about your next project."
        image={pageImages.contact.src}
        imageAlt={pageImages.contact.alt}
      />
      <section className="contact-page">
        <div className="wrap contact-grid">
          <div>
            <figure className="contact-photo">
              <Image
                src={pageImages.about.src}
                alt={pageImages.about.alt}
                width={960}
                height={640}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
            </figure>
            <h2>How we can help</h2>
            <ul className="contact-list">
              <li>Market entry strategy for international expansion</li>
              <li>BIM management and A/E/C process advisory</li>
              <li>ROI advisory for commercial performance</li>
            </ul>
          </div>
          <div className="contact-panel">
            <p className="kicker">Direct</p>
            <a className="contact-email" href={contactMailto}>
              {contactEmail}
            </a>
            <p className="contact-note">
              Domain ·{" "}
              <a href="http://exhibium.com/" target="_blank" rel="noopener noreferrer">
                exhibium.com
              </a>
            </p>
            <p className="contact-regions">
              United States · Latin America · Middle East
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
