"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import HTMLFlipBook from "react-pageflip";

export type PresentationDoc = {
  id: string;
  label: string;
  slides: readonly string[];
};

type Props = {
  open: boolean;
  doc: PresentationDoc | null;
  onClose: () => void;
};

const BookPage = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(function BookPage({ children, className = "" }, ref) {
  return (
    <div ref={ref} className={`ppt-book-page ${className}`.trim()}>
      {children}
    </div>
  );
});

export function PresentationBook({ open, doc, onClose }: Props) {
  const bookRef = useRef<{
    pageFlip?: () => { flip: (page: number) => void };
  }>(null);
  const [page, setPage] = useState(0);
  const [dims, setDims] = useState({ width: 720, height: 405 });

  const total = doc?.slides.length ?? 0;

  useEffect(() => {
    const update = () => {
      const vw = Math.min(window.innerWidth - 48, 960);
      const vh = Math.min(window.innerHeight - 160, 620);
      // 16:9 slides
      let width = vw;
      let height = Math.round(width * (9 / 16));
      if (height > vh) {
        height = vh;
        width = Math.round(height * (16 / 9));
      }
      setDims({ width: Math.max(280, width), height: Math.max(160, height) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    setPage(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") flipTo(Math.min(total - 1, page + 1));
      if (e.key === "ArrowLeft") flipTo(Math.max(0, page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, page, total]);

  const flipTo = useCallback((next: number) => {
    try {
      bookRef.current?.pageFlip?.()?.flip(next);
    } catch {
      /* ignore */
    }
  }, []);

  if (!open || !doc || total === 0) return null;

  return (
    <div
      className="ppt-book-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={doc.label}
    >
      <button
        type="button"
        className="ppt-book-backdrop"
        aria-label="Close presentation"
        onClick={onClose}
      />

      <div className="ppt-book-shell">
        <div className="ppt-book-toolbar">
          <p className="ppt-book-toolbar-label">{doc.label}</p>
          <button type="button" className="ppt-book-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="ppt-book-stage">
          <HTMLFlipBook
            key={doc.id}
            ref={bookRef as never}
            width={dims.width}
            height={dims.height}
            size="fixed"
            showCover
            drawShadow
            flippingTime={650}
            usePortrait
            mobileScrollSupport
            swipeDistance={24}
            maxShadowOpacity={0.4}
            className="ppt-book-flip"
            onFlip={(e) => setPage(e.data)}
          >
            {doc.slides.map((src, index) => (
              <BookPage key={src} className="ppt-book-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${doc.label} — slide ${index + 1}`}
                  draggable={false}
                />
              </BookPage>
            ))}
          </HTMLFlipBook>
        </div>

        <div className="ppt-book-nav">
          <button
            type="button"
            className="cta cta-ghost"
            onClick={() => flipTo(Math.max(0, page - 1))}
            disabled={page <= 0}
          >
            ← Prev
          </button>
          <span>
            {page + 1} / {total}
          </span>
          <button
            type="button"
            className="cta cta-ghost"
            onClick={() => flipTo(Math.min(total - 1, page + 1))}
            disabled={page >= total - 1}
          >
            Next →
          </button>
        </div>
        <p className="ppt-book-hint">Swipe or drag corners to turn pages</p>
      </div>
    </div>
  );
}
