import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";

export function Approach() {
  return (
    <section className="approach">
      <div className="wrap">
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
              </div>
              <div className="approach-card-body">
                <span>{s.num}</span>
                <h3>{s.label}</h3>
                {s.subtitle ? <p>{s.subtitle}</p> : null}
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
