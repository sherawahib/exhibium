"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  typeSpeed?: number;
};

/** Types once, then stops — avoids endless setState loops that hang the page. */
export function TypewriterText({
  text,
  className,
  typeSpeed = 55,
}: Props) {
  const [display, setDisplay] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(text);
      setShowCursor(false);
      return;
    }

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cursorTimer: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) {
        setShowCursor(false);
        return;
      }
      timeoutId = setTimeout(tick, typeSpeed);
    };

    timeoutId = setTimeout(tick, 400);
    cursorTimer = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);

    return () => {
      clearTimeout(timeoutId);
      if (cursorTimer) clearInterval(cursorTimer);
    };
  }, [text, typeSpeed]);

  return (
    <p className={className} aria-label={text}>
      <span className="typewriter-text">{display}</span>
      {showCursor && <span className="typewriter-cursor" aria-hidden="true" />}
    </p>
  );
}
