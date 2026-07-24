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

    const onScroll = () => {
      const img = imgRef.current;
      if (!img) return;
      const y = window.scrollY || 0;
      img.style.transform = `scale(1.04) translate3d(0, ${y * 0.14}px, 0)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          text="EXHIBIUM Advisory services"
          className="splash-brand"
        />
        <h1 className="splash-line">
          Branding · BIM modeling · Modular construction · ROI advisory · Market
          entry · Strategy and Execution.
        </h1>
        <div className="splash-cta">
          <Link className="cta cta-fill" href="/appointment">
            Book Appointment
          </Link>
          <Link className="cta cta-line" href="/services">
            View services
          </Link>
        </div>
      </div>
    </section>
  );
}
