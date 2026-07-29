"use client";

import Image from "next/image";
import { useState } from "react";
import { ServiceBook } from "@/components/ServiceBook";
import { services, type ServiceSlug } from "@/lib/site";

export function Practice() {
  const [bookOpen, setBookOpen] = useState(false);
  const [startSlug, setStartSlug] = useState<ServiceSlug | null>(null);

  const openBook = (slug: ServiceSlug | null = null) => {
    setStartSlug(slug);
    setBookOpen(true);
  };

  return (
    <section className="practice">
      <div className="wrap">
        <div className="practice-head">
          <p className="kicker">Practice groups</p>
          <h2>Three specialist houses. One delivery standard.</h2>
          <p className="practice-client-note">
            The core client sector for these services is architects and
            developers.
          </p>
          <button
            type="button"
            className="service-pdf-trigger"
            onClick={() => openBook(null)}
          >
            <Image
              src="/pdf-icon.png"
              alt=""
              width={40}
              height={48}
              className="service-pdf-icon"
            />
            <span>
              <strong>Open services brochure</strong>
              <em>PDF-style book · swipe pages</em>
            </span>
          </button>
        </div>

        <div className="service-zigzag">
          {services.map((service, index) => {
            const reverse = index % 2 === 1;
            const markets =
              "markets" in service ? service.markets : undefined;
            const offerings =
              "offerings" in service ? service.offerings : undefined;

            return (
              <article
                key={service.slug}
                id={service.slug}
                className={`service-row${reverse ? " service-row-reverse" : ""}`}
              >
                <figure className="service-row-media">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  <button
                    type="button"
                    className="service-row-pdf"
                    onClick={() => openBook(service.slug)}
                    aria-label={`Open ${service.label} in brochure`}
                  >
                    <Image
                      src="/pdf-icon.png"
                      alt=""
                      width={36}
                      height={44}
                    />
                  </button>
                </figure>

                <div className="service-row-copy">
                  <span className="service-row-num">{service.num}</span>
                  <h3>{service.title}</h3>
                  {service.subtitle ? (
                    <p className="service-row-sub">{service.subtitle}</p>
                  ) : null}
                  {service.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}

                  {markets ? (
                    <div className="service-row-block">
                      <h4>Markets / clients served</h4>
                      {markets.map((market) => (
                        <div key={market.title} className="service-market">
                          <p className="service-market-title">{market.title}</p>
                          <ul>
                            {market.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {offerings ? (
                    <div className="service-row-block">
                      <h4>Key offerings include</h4>
                      <ul className="service-offerings">
                        {offerings.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="service-pdf-inline"
                    onClick={() => openBook(service.slug)}
                  >
                    <Image
                      src="/pdf-icon.png"
                      alt=""
                      width={28}
                      height={34}
                    />
                    View in brochure
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ServiceBook
        open={bookOpen}
        startSlug={startSlug}
        onClose={() => setBookOpen(false)}
      />
    </section>
  );
}
