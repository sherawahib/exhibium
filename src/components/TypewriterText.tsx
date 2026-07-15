"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
};

export function TypewriterText({
  text,
  className,
  typeSpeed = 90,
  deleteSpeed = 55,
  pauseMs = 2200,
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
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setDisplay(text.slice(0, index));

        if (index >= text.length) {
          timeoutId = setTimeout(() => {
            deleting = true;
            tick();
          }, pauseMs);
          return;
        }

        timeoutId = setTimeout(tick, typeSpeed);
        return;
      }

      index -= 1;
      setDisplay(text.slice(0, index));

      if (index <= 0) {
        deleting = false;
        timeoutId = setTimeout(tick, 420);
        return;
      }

      timeoutId = setTimeout(tick, deleteSpeed);
    };

    timeoutId = setTimeout(tick, 500);

    const cursorTimer = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(cursorTimer);
    };
  }, [text, typeSpeed, deleteSpeed, pauseMs]);

  return (
    <p className={className} aria-label={text}>
      <span className="typewriter-text">{display}</span>
      {showCursor && <span className="typewriter-cursor" aria-hidden="true" />}
    </p>
  );
}
