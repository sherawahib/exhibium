"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { services, type ServiceSlug } from "@/lib/site";

type Props = {
  open: boolean;
  onClose: () => void;
  startSlug?: ServiceSlug | null;
};

const BookPage = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(function BookPage({ children, className = "" }, ref) {
  return (
    <div ref={ref} className={`service-book-page ${className}`.trim()}>
      {children}
    </div>
  );
});

export function ServiceBook({ open, onClose, startSlug = null }: Props) {
  const bookRef = useRef<{
    pageFlip?: () => { flip: (page: number) => void };
  }>(null);
  const [page, setPage] = useState(0);
  const [dims, setDims] = useState({ width: 420, height: 580 });

  const startIndex = useMemo(() => {
    if (!startSlug) return 0;
    const idx = services.findIndex((s) => s.slug === startSlug);
    return idx >= 0 ? 2 + idx * 2 : 0;
  }, [startSlug]);

  const totalPages = 2 + services.length * 2;

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 520) {
        setDims({
          width: Math.min(320, vw - 48),
          height: Math.min(460, window.innerHeight - 160),
        });
      } else if (vw < 900) {
        setDims({ width: 380, height: 520 });
      } else {
        setDims({ width: 440, height: 600 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") flipTo(Math.min(totalPages - 1, page + 1));
      if (e.key === "ArrowLeft") flipTo(Math.max(0, page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, page, totalPages]);

  useEffect(() => {
    if (!open) return;
    setPage(startIndex);
    const t = window.setTimeout(() => {
      try {
        bookRef.current?.pageFlip?.()?.flip(startIndex);
      } catch {
        /* mounting */
      }
    }, 120);
    return () => window.clearTimeout(t);
  }, [open, startIndex]);

  const flipTo = useCallback((next: number) => {
    try {
      bookRef.current?.pageFlip?.()?.flip(next);
    } catch {
      /* ignore */
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="service-book-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Services brochure"
    >
      <button
        type="button"
        className="service-book-backdrop"
        aria-label="Close brochure"
        onClick={onClose}
      />

      <div className="service-book-shell">
        <div className="service-book-toolbar">
          <p className="service-book-toolbar-label">
            Exhibium services brochure
          </p>
          <button
            type="button"
            className="service-book-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="service-book-stage">
          <HTMLFlipBook
            ref={bookRef as never}
            width={dims.width}
            height={dims.height}
            size="stretch"
            minWidth={280}
            maxWidth={480}
            minHeight={400}
            maxHeight={640}
            showCover
            drawShadow
            flippingTime={700}
            usePortrait
            mobileScrollSupport
            swipeDistance={28}
            maxShadowOpacity={0.45}
            className="service-book-flip"
            onFlip={(e) => setPage(e.data)}
          >
            <BookPage className="service-book-cover">
              <p className="kicker">Exhibium Group</p>
              <h2>EXHIBIUM Advisory Services</h2>
              <p>BIM / VDC · Modular Construction · Market Entry</p>
              <p className="service-book-hint">Swipe or drag to turn pages</p>
            </BookPage>

            <BookPage>
              <p className="kicker">Client focus</p>
              <h3>Core client sector</h3>
              <p>
                The core client sector for these services is architects and
                developers.
              </p>
              <p>
                Over the years Exhibium has focused on a technology-driven
                advisory service for the A/E/C sectors via its BIM and Modular
                Groups. Our Market Entry group primarily serves architecture,
                real estate developers, and retail sectors wishing to expand
                into the USA, Latin America, and the Middle East.
              </p>
            </BookPage>

            {services.flatMap((service) => {
              const markets =
                "markets" in service ? service.markets : undefined;
              const offerings =
                "offerings" in service ? service.offerings : undefined;

              return [
                <BookPage
                  key={`${service.slug}-img`}
                  className="service-book-media-page"
                >
                  <div className="service-book-media">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="480px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p className="service-book-media-caption">
                    {service.num} · {service.label}
                  </p>
                </BookPage>,
                <BookPage key={`${service.slug}-copy`}>
                  <span className="service-book-num">{service.num}</span>
                  <h3>{service.title}</h3>
                  {service.subtitle ? (
                    <p className="service-book-sub">{service.subtitle}</p>
                  ) : null}
                  {service.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                  {markets ? (
                    <>
                      <h4>Markets / clients served</h4>
                      {markets.map((market) => (
                        <div key={market.title} className="service-book-market">
                          <strong>{market.title}</strong>
                          <ul>
                            {market.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </>
                  ) : null}
                  {offerings ? (
                    <>
                      <h4>Key offerings include</h4>
                      <ul>
                        {offerings.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </BookPage>,
              ];
            })}
          </HTMLFlipBook>
        </div>

        <div className="service-book-nav">
          <button
            type="button"
            className="cta cta-ghost"
            onClick={() => flipTo(Math.max(0, page - 1))}
            disabled={page <= 0}
          >
            ← Prev
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="cta cta-ghost"
            onClick={() => flipTo(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
