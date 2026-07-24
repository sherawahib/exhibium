"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { RegionId } from "@/lib/projects";

const ProjectGlobe = dynamic(
  () => import("@/components/ProjectGlobe").then((m) => m.ProjectGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="atlas-globe-loading" aria-live="polite">
        Loading globe…
      </div>
    ),
  }
);

type Props = {
  region: RegionId;
  activePin: string | null;
};

export function AtlasGlobe({ region, activePin }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const next = {
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
        };
        setSize((prev) =>
          prev.width === next.width && prev.height === next.height
            ? prev
            : next
        );
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="atlas-globe" ref={shellRef}>
      {size.width > 0 ? (
        <ProjectGlobe
          region={region}
          activePin={activePin}
          width={size.width}
          height={size.height}
        />
      ) : null}
    </div>
  );
}
