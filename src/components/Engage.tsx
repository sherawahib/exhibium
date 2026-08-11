"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { contactEmail, contactMailto } from "@/lib/site";

export function Engage({
  compact = false,
  image = "/projects.jpg",
  sideImage = "/engage-side-v2.png",
  sideImageAlt = "Market entry strategy presentation in a corporate boardroom",
}: {
  compact?: boolean;
  image?: string;
  sideImage?: string;
  sideImageAlt?: string;
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
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 60;
      img.style.transform = `scale(1.1) translate3d(0, ${offset}px, 0)`;
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

      <div className="wrap engage-layout">
        <div className="engage-box">
          <p className="kicker">Next engagement</p>
          <h2>Ready for senior advisory on your next market move?</h2>
          <p>
            Book a consultation or write directly — we respond with clear scope,
            timelines, and the right practice lead.
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
              <a className="cta cta-ghost" href={contactMailto}>
                {contactEmail}
              </a>
            )}
          </div>
        </div>

        <figure className="engage-side">
          <Image
            src={sideImage}
            alt={sideImageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 46vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </figure>
      </div>
    </section>
  );
}
