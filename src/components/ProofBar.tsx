import Link from "next/link";
import { getAllProjectCount } from "@/lib/projects";

const metrics = [
  { value: "30+", label: "Years in A/E/C development" },
  { value: String(getAllProjectCount()), label: "Projects across three regions" },
  { value: "3", label: "Specialist practice groups" },
] as const;

export function ProofBar() {
  return (
    <section className="proof-bar" aria-label="Firm credentials">
      <div className="wrap proof-bar-inner">
        <div className="proof-bar-copy">
          <p className="kicker">Why Exhibium</p>
          <h2>Board-level advice. Field-ready execution.</h2>
        </div>
        <ul className="proof-metrics">
          {metrics.map((m) => (
            <li key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
        <Link className="proof-link" href="/about">
          About the firm →
        </Link>
      </div>
    </section>
  );
}
