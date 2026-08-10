"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

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
        img.style.transform = `scale(1.06) translate3d(0, ${y * 0.12}px, 0)`;
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
          src="/about-banner-v2.png"
          alt="Executive boardroom meeting in silhouette against a city skyline"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 45%" }}
        />
        <div className="splash-shade" aria-hidden="true" />
      </div>

      <div className="splash-copy">
        <p className="splash-kicker">Exhibium Advisory Services</p>
        <h1 className="splash-brand">
          Senior counsel for market entry, BIM, and modular growth.
        </h1>
        <p className="splash-lede">
          Independent advisory for A/E/C firms, developers, and investors across
          the Americas and the Middle East — with executable deliverables, not
          slide theater.
        </p>
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
