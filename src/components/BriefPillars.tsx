import { briefGroups, briefModularLine, briefTaglines } from "@/lib/brief";

export function BriefPillars() {
  return (
    <section className="brief-pillars">
      <div className="wrap">
        <div className="brief-pillars-head">
          <p className="kicker">From the brief</p>
          <h2>{briefModularLine}</h2>
        </div>

        <ul className="brief-tag-stack">
          {briefTaglines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="brief-group-row">
          {briefGroups.map((group) => (
            <span key={group}>{group}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
