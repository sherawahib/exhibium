"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { TypewriterText } from "@/components/TypewriterText";

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const img = imgRef.current;
        if (!img) return;
        const y = window.scrollY || 0;
        img.style.transform = `scale(1.04) translate3d(0, ${y * 0.14}px, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="splash" id="top">
      <div className="splash-visual">
        <Image
          ref={imgRef}
          src="/hero.png"
          alt="Executive boardroom meeting in silhouette against a city skyline"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 45%" }}
        />
        <div className="splash-shade" aria-hidden="true" />
      </div>
      <div className="splash-copy">
        <TypewriterText
          text="EXHIBIUM Advisory Services"
          className="splash-brand"
        />
        <div className="splash-intro">
          <p>
            Exhibium Group is a multi-faceted consultancy providing advisory
            services to the Architecture, Engineering, and Construction (A/E/C)
            commercial sectors and Real Estate developers.
          </p>
          <p>
            We advise executives, investors, developers, and growing
            organizations on expansion, market entry, commercial performance, and
            transformation. We provide independent senior-level advice with
            executable deliverables.
          </p>
          <p>
            With over 30 years&apos; development experience in the A/E/C sector,
            Exhibium is now focused on providing enhanced growth, market
            expansion, commercial strategy, and execution.
          </p>
        </div>
        <div className="splash-cta">
          <Link className="cta cta-fill" href="/appointment">
            Book Appointment
          </Link>
          <Link className="cta cta-line" href="/services">
            View services
          </Link>
        </div>
      </div>
      <div className="splash-partner-logo">
        <Image
          src="/ae-advisory-logo.png"
          alt="AE Advisory"
          width={150}
          height={150}
          priority
        />
      </div>
    </section>
  );
}
