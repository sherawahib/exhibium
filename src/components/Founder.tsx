"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { founderProfile } from "@/lib/brief";

const stats = [
  { value: "30+", label: "Years across A/E/C markets" },
  { value: "3", label: "Core practice groups" },
  { value: "3", label: "Regions of delivery" },
] as const;

const regions = ["United States", "Latin America", "Middle East"] as const;

export function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const layer = layerRef.current;
        if (!section || !layer) return;
        const offset = section.getBoundingClientRect().top * -0.32;
        layer.style.transform = `translate3d(0, ${offset}px, 0) scale(1.18)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const [lead, ...rest] = founderProfile.paragraphs;

  return (
    <section ref={sectionRef} className="founder" id="leadership">
      <div className="founder-parallax" aria-hidden="true">
        <div ref={layerRef} className="founder-parallax-layer">
          <Image
            src="/about-bim-workstation.png"
            alt=""
            fill
            sizes="100vw"
            className="founder-parallax-img"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
            priority
          />
        </div>
        <div className="founder-parallax-shade" />
      </div>

      <div className="wrap founder-layout">
        <div className="founder-copy">
          <p className="kicker">{founderProfile.kicker}</p>
          <h2>{founderProfile.headline}</h2>
          <p className="founder-lead">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <p className="founder-closing">{founderProfile.closing}</p>
          <div className="founder-actions">
            <Link className="cta cta-fill" href="/appointment">
              Book a consultation
            </Link>
            <Link className="cta cta-line" href="/services">
              View practices
            </Link>
          </div>
        </div>

        <aside className="founder-aside">
          <div className="founder-aside-card">
            <p className="founder-aside-label">Founder & Director</p>
            <h3>Fernando Williams</h3>
            <p>
              Architecture-trained strategic advisor with international delivery
              across retail, development, BIM, and market entry.
            </p>
          </div>

          <ul className="founder-stats">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="founder-regions">
            <p className="founder-aside-label">Markets</p>
            <ul>
              {regions.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
