import Image from "next/image";
import Link from "next/link";
import { pageImages } from "@/lib/site";
import { executiveSummary } from "@/lib/brief";

const principles = [
  { num: "01", label: "Senior thinking" },
  { num: "02", label: "Direct advice" },
  { num: "03", label: "Executable deliverables" },
] as const;

export function Statement({ showMedia = true }: { showMedia?: boolean }) {
  return (
    <section className="statement">
      <div className="statement-glow" aria-hidden="true" />
      <div className={`wrap${showMedia ? " statement-layout" : ""}`}>
        <div className="statement-copy">
          <p className="kicker statement-kicker">
            <span>{executiveSummary.kicker}</span>
          </p>
          <h2>{executiveSummary.headline}</h2>
          <p className="lede">{executiveSummary.primary}</p>

          <ul className="statement-principles" aria-label="Approach principles">
            {principles.map((item) => (
              <li key={item.num}>
                <span className="statement-principle-num">{item.num}</span>
                <span className="statement-principle-label">{item.label}</span>
              </li>
            ))}
          </ul>

          <div className="statement-aside">
            <p className="statement-focus">{executiveSummary.focus}</p>
            <p className="lede statement-board">{executiveSummary.board}</p>
          </div>

          <div className="statement-actions">
            <Link className="cta cta-ink" href="/services">
              Explore services
            </Link>
            <Link className="cta cta-text" href="/appointment">
              Book a consultation →
            </Link>
          </div>
        </div>

        {showMedia ? (
          <figure className="statement-media">
            <Image
              src={pageImages.about.src}
              alt={pageImages.about.alt}
              width={920}
              height={720}
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <figcaption className="statement-media-caption">
              <span>Advisory practice</span>
              <strong>Strategy to delivery</strong>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
