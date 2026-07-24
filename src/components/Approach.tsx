import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";

const steps = [
  {
    num: "01",
    title: "Board-level strategy",
    text: "Every engagement is reviewed by division advisory boards before senior project managers lead implementation.",
  },
  {
    num: "02",
    title: "Emotional Commerce",
    text: "Visual and experiential motivators designed to increase dwell time, brand memory, and in-store spending.",
  },
  {
    num: "03",
    title: "ROI-led delivery",
    text: "Market entry, branding, BIM, and modular programs measured against commercial performance—not slideshows.",
  },
];

export function Approach() {
  return (
    <section className="approach">
      <div className="wrap">
        <div className="approach-head">
          <p className="kicker">How we work</p>
          <h2>Strategy reviewed at the top. Execution owned on the ground.</h2>
          <p className="approach-lede">
            Branding, Process Management, and Development Projects—delivered
            through the Advisory Consulting Group, BIM Management Group, and
            Modular Development Group. Strategy and Execution, Market Entry
            Services, and ROI Advisory Services sit at the center of every
            engagement.
          </p>
        </div>

        <ol className="approach-steps">
          {steps.map((step) => (
            <li key={step.num}>
              <span className="approach-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="approach-showcase">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="approach-card"
            >
              <div className="approach-card-media">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="approach-card-body">
                <span>{s.num}</span>
                <h3>{s.label}</h3>
                <p>{s.summary}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="approach-cta-row">
          <Link className="cta cta-ink" href="/services">
            View all services
          </Link>
          <Link className="cta cta-text" href="/about">
            Meet the founder →
          </Link>
        </div>
      </div>
    </section>
  );
}
