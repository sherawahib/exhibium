import Image from "next/image";
import { services } from "@/lib/site";

export function Practice() {
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
        </div>

        <div className="service-zigzag">
          {services.map((service, index) => {
            const reverse = index % 2 === 1;
            const markets =
              "markets" in service ? service.markets : undefined;
            const offerings =
              "offerings" in service ? service.offerings : undefined;
            const docs = "docs" in service ? service.docs : undefined;

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

                  {docs ? (
                    <div className="service-row-block service-docs">
                      <h4>Presentations</h4>
                      <div className="service-doc-list">
                        {docs.map((doc) => (
                          <a
                            key={doc.href}
                            className="service-doc-card"
                            href={doc.href}
                            download={doc.fileName}
                          >
                            <Image
                              src="/pdf-icon.png"
                              alt=""
                              width={36}
                              height={44}
                            />
                            <span>
                              <strong>{doc.label}</strong>
                              <em>PowerPoint · Download</em>
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
