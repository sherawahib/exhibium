import { partnersFromBrief } from "@/lib/brief";

export function Alliances() {
  const advisory = partnersFromBrief.filter((p) => p.section === "advisory");
  const clients = partnersFromBrief.filter((p) => p.section === "client");

  return (
    <section className="alliances">
      <div className="wrap">
        <div className="alliances-head">
          <p className="kicker">Exhibium Advisory partners / long-term clients</p>
          <h2>Relationships measured in decades, not decks.</h2>
        </div>

        <div className="alliance-section">
          <h3 className="alliance-section-title">Advisory Partner Relationships</h3>
          <ol className="alliance-timeline">
            {advisory.map((p) => (
              <li key={p.name}>
                <time>{p.term}</time>
                <div>
                  <h3>{p.name}</h3>
                  <ul className="alliance-bullets">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.linkLabel}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="alliance-section">
          <h3 className="alliance-section-title">Long Term Client Consultancies</h3>
          <ol className="alliance-timeline">
            {clients.map((p) => (
              <li key={p.name}>
                <time>{p.term}</time>
                <div>
                  <h3>{p.name}</h3>
                  <ul className="alliance-bullets">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.linkLabel}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
