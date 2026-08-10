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

        <div className="approach-showcase">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
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
                <span className="approach-card-index">{s.num}</span>
              </div>
              <div className="approach-card-body">
                <h3>{s.label}</h3>
                <p>{s.summary}</p>
                <span className="approach-card-link">Explore practice</span>
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
