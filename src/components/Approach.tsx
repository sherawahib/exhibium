import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";

export function Approach() {
  return (
    <section className="approach" id="practices">
      <div className="wrap">
        <div className="approach-head">
          <p className="kicker">Practice groups</p>
          <h2>Three advisory lines. One standard of execution.</h2>
          <p className="approach-lede">
            BIM/VDC project management, modular construction pathways, and
            international market entry — each led with senior oversight and
            deliverables you can put to work.
          </p>
        </div>

        <div className="approach-rail">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
              className="approach-feature"
            >
              <div className="approach-feature-media">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="approach-feature-copy">
                <span className="approach-feature-num">{s.num}</span>
                <h3>{s.label}</h3>
                <p>{s.summary}</p>
                <span className="approach-feature-cta">Explore practice</span>
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
