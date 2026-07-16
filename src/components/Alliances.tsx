import { partnersFromBrief } from "@/lib/brief";

export function Alliances() {
  const advisory = partnersFromBrief.filter((p) => p.section === "advisory");
  const clients = partnersFromBrief.filter((p) => p.section === "client");

  return (
    <section className="alliances">
      <div className="wrap alliances-wrap">
        <div className="alliances-head">
          <p className="kicker">
            Exhibium Advisory partners / long-term clients
          </p>
          <h2>Relationships measured in decades, not decks.</h2>
        </div>

        <div className="alliance-section">
          <h3 className="alliance-section-title">
            Advisory Partner Relationships
          </h3>
          <div className="partner-list">
            {advisory.map((p) => (
              <article key={p.name} className="partner-card">
                <header className="partner-card-head">
                  <time dateTime={p.term}>{p.term}</time>
                  <h3>{p.name}</h3>
                </header>
                <ul className="partner-card-bullets">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a
                  className="partner-card-link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.linkLabel}
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="alliance-section">
          <h3 className="alliance-section-title">
            Long Term Client Consultancies
          </h3>
          <div className="partner-list">
            {clients.map((p) => (
              <article key={p.name} className="partner-card">
                <header className="partner-card-head">
                  <time dateTime={p.term}>{p.term}</time>
                  <h3>{p.name}</h3>
                </header>
                <ul className="partner-card-bullets">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a
                  className="partner-card-link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.linkLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
