import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { Founder } from "@/components/Founder";
import { Engage } from "@/components/Engage";
import {
  briefCapabilities,
  briefGroups,
  executiveSummary,
} from "@/lib/brief";
import { pageImages, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leadership and experience at Exhibium Group: international perspective and entrepreneurial execution across the Americas and Middle East.",
};

const method = [
  {
    num: "01",
    title: "Board-level review",
    text: "Strategic advisories are reviewed by an advisory board of senior A/E/C practitioners before work begins.",
  },
  {
    num: "02",
    title: "Senior assignment",
    text: "Engagements are assigned to experienced project managers accountable for execution quality.",
  },
  {
    num: "03",
    title: "Executable delivery",
    text: "Advice is translated into roadmaps, controls, and deliverables leadership teams can act on.",
  },
] as const;

const regions = [
  {
    title: "United States",
    text: "Retail, development, and A/E/C advisory for domestic growth and outbound expansion.",
  },
  {
    title: "Latin America",
    text: "Market entry, retail systems, and partner networks across key commercial markets.",
  },
  {
    title: "Middle East",
    text: "Expansion support for retailers, developers, and strategic partners entering regional markets.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageBanner
        kicker="The firm"
        title="About Exhibium"
        description="A multi-faceted consultancy for market entry, BIM/VDC, and modular growth — led with senior oversight and international delivery."
        image={pageImages.about.src}
        imageAlt={pageImages.about.alt}
      />

      <section className="about-intro">
        <div className="wrap about-intro-layout">
          <div className="about-intro-copy">
            <p className="kicker">{executiveSummary.kicker}</p>
            <h2>{executiveSummary.headline}</h2>
            <p className="about-intro-lede">{executiveSummary.primary}</p>
            <p className="about-intro-focus">{executiveSummary.focus}</p>
            <p>{executiveSummary.board}</p>
            <div className="about-intro-actions">
              <Link className="cta cta-ink" href="/appointment">
                Book Appointment
              </Link>
              <Link className="cta cta-text" href="#leadership">
                Meet leadership →
              </Link>
            </div>
          </div>

          <figure className="about-intro-media">
            <Image
              src="/projects.jpg"
              alt="Luxury commercial atrium representing international retail and development work"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              style={{ objectFit: "cover" }}
            />
            <figcaption>
              <span>Exhibium Group</span>
              <strong>Strategy to delivery</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-pillars">
        <div className="wrap">
          <div className="about-pillars-head">
            <p className="kicker">Practice houses</p>
            <h2>Three specialist lines under one standard.</h2>
          </div>
          <div className="about-pillars-grid">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services#${s.slug}`}
                className="about-pillar"
              >
                <span>{s.num}</span>
                <h3>{s.label}</h3>
                <p>{s.summary}</p>
                <em>Explore practice</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Founder />

      <section className="about-method">
        <div className="wrap">
          <div className="about-method-head">
            <p className="kicker">How we work</p>
            <h2>Advisory discipline before delivery.</h2>
            <p>
              Exhibium is managed with board-level oversight. Strategy is
              reviewed first; implementation follows with senior accountability.
            </p>
          </div>
          <ol className="about-method-list">
            {method.map((item) => (
              <li key={item.num}>
                <span>{item.num}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-capabilities">
        <div className="wrap about-capabilities-layout">
          <div className="about-capabilities-copy">
            <p className="kicker">Capabilities</p>
            <h2>What we bring to every engagement.</h2>
            <p>
              From branding and process management to market entry and ROI
              advisory, Exhibium connects complementary disciplines under one
              direction.
            </p>
            <ul className="about-group-list" aria-label="Practice groups">
              {briefGroups.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <ul className="about-capability-grid">
            {briefCapabilities.map((c, i) => (
              <li key={c}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{c}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-regions">
        <div className="wrap">
          <div className="about-regions-head">
            <p className="kicker">Geographic reach</p>
            <h2>Built for cross-border expansion.</h2>
          </div>
          <div className="about-regions-grid">
            {regions.map((r) => (
              <article key={r.title} className="about-region">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
          <div className="about-regions-actions">
            <Link className="cta cta-ink" href="/projects">
              View project atlas
            </Link>
            <Link className="cta cta-text" href="/partners">
              See alliances →
            </Link>
          </div>
        </div>
      </section>

      <Engage compact image="/projects.jpg" />
    </>
  );
}
