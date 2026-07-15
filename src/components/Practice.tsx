import Image from "next/image";
import Link from "next/link";
import { capabilities, services } from "@/lib/site";

export function Practice() {
  return (
    <section className="practice">
      <div className="wrap">
        <div className="practice-head">
          <p className="kicker">Practice groups</p>
          <h2>Three specialist houses. One delivery standard.</h2>
        </div>

        <div className="service-grid">
          {services.map((g) => (
            <Link key={g.slug} href={`/services/${g.slug}`} className="service-card">
              <div className="service-card-media">
                <Image
                  src={g.image}
                  alt={g.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="service-card-body">
                <span className="service-card-num">{g.num}</span>
                <h3>{g.title}</h3>
                <p>{g.summary}</p>
                <span className="service-card-link">View practice →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="capability-rail" aria-label="Core capabilities">
          {capabilities.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
