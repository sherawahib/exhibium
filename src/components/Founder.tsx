"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { founderProfile } from "@/lib/brief";

export function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const img = imgRef.current;
        if (!section || !img) return;

        const rect = section.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 110;
        img.style.transform = `scale(1.16) translate3d(0, ${offset}px, 0)`;
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

  return (
    <section ref={sectionRef} className="founder">
      <div className="founder-parallax" aria-hidden="true">
        <Image
          ref={imgRef}
          src="/boardroom.png"
          alt=""
          fill
          sizes="100vw"
          className="founder-parallax-img"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div className="founder-parallax-shade" />
      </div>

      <div className="wrap founder-copy">
        <p className="kicker">{founderProfile.kicker}</p>
        <h2>{founderProfile.headline}</h2>
        {founderProfile.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <p className="founder-closing">{founderProfile.closing}</p>
      </div>
    </section>
  );
}
