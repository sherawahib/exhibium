"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function Engage({
  compact = false,
  image = "/projects.jpg",
  imageAlt = "Luxury retail atrium with layered architecture and warm light",
}: {
  compact?: boolean;
  image?: string;
  imageAlt?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onScroll = () => {
      const section = sectionRef.current;
      const img = imgRef.current;
      if (!section || !img) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // Move image slower than scroll while section is in view
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 120;
      img.style.transform = `scale(1.18) translate3d(0, ${offset}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`engage${compact ? " engage-compact" : ""}`}
    >
      <div className="engage-parallax" aria-hidden="true">
        <Image
          ref={imgRef}
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="engage-parallax-img"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="engage-parallax-shade" />
      </div>

      <div className="wrap engage-box">
        <p className="kicker">Next step</p>
        <h2>Bring Exhibium into your next market entry strategy.</h2>
        <p>
          Market entry BIM oversight. Branding for commercial performance. Talk
          with the team that has delivered across the Americas and the Middle
          East.
        </p>
        <div className="engage-actions">
          <Link className="cta cta-fill cta-lg" href="/appointment">
            Book Appointment
          </Link>
          {!compact ? (
            <Link className="cta cta-ghost" href="/contact">
              Contact page
            </Link>
          ) : (
            <a className="cta cta-ghost" href="mailto:info@exhibium.com">
              info@exhibium.com
            </a>
          )}
        </div>
        <span className="sr-only">{imageAlt}</span>
      </div>
    </section>
  );
}
