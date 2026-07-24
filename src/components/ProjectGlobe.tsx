"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { RegionId } from "@/lib/projects";
import {
  getAllHighlightCountries,
  getAllHighlightStates,
  getMarketHighlight,
  getPinHighlightCountries,
  getPinHighlightStates,
  getRegionHighlightCountries,
  getRegionHighlightStates,
  regionFocus,
} from "@/lib/globeHighlights";

type GlobeFeature = Feature<Geometry> & {
  properties: Record<string, unknown>;
  __kind: "country" | "state";
  __key: string;
};

type GlobeInstance = {
  (el: HTMLElement): GlobeInstance;
  width: (n: number) => GlobeInstance;
  height: (n: number) => GlobeInstance;
  backgroundColor: (c: string) => GlobeInstance;
  globeImageUrl: (u: string) => GlobeInstance;
  bumpImageUrl: (u: string) => GlobeInstance;
  atmosphereColor: (c: string) => GlobeInstance;
  atmosphereAltitude: (n: number) => GlobeInstance;
  showGraticules: (v: boolean) => GlobeInstance;
  polygonsData: (d: object[]) => GlobeInstance;
  polygonCapColor: (fn: (d: object) => string) => GlobeInstance;
  polygonSideColor: (fn: (d: object) => string) => GlobeInstance;
  polygonStrokeColor: (fn: (d: object) => string) => GlobeInstance;
  polygonAltitude: (fn: (d: object) => number) => GlobeInstance;
  polygonLabel: (fn: (d: object) => string) => GlobeInstance;
  onPolygonHover: (fn: (d: object | null) => void) => GlobeInstance;
  polygonsTransitionDuration: (n: number) => GlobeInstance;
  pointOfView: (
    view: { lat: number; lng: number; altitude: number },
    ms?: number
  ) => GlobeInstance;
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    addEventListener: (type: string, fn: () => void) => void;
    removeEventListener: (type: string, fn: () => void) => void;
  };
  _destructor?: () => void;
};

type Props = {
  region: RegionId;
  activePin: string | null;
  width: number;
  height: number;
};

const COLOR = {
  dim: "rgba(55, 72, 98, 0.22)",
  work: "rgba(196, 112, 48, 0.55)",
  region: "rgba(224, 120, 40, 0.82)",
  selected: "rgba(255, 196, 120, 0.95)",
  side: "rgba(8, 16, 32, 0.35)",
  stroke: "rgba(12, 22, 40, 0.55)",
};

const ISO_BY_NUMERIC: Record<number, string> = {
  484: "MEX",
  222: "SLV",
  591: "PAN",
  188: "CRI",
  214: "DOM",
  170: "COL",
  862: "VEN",
  218: "ECU",
  604: "PER",
  68: "BOL",
  152: "CHL",
  682: "SAU",
  634: "QAT",
  784: "ARE",
  643: "RUS",
  840: "USA",
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-globe-src="${src}"]`
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.globeSrc = src;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    Globe?: () => GlobeInstance;
  }
}

export function ProjectGlobe({ region, activePin, width, height }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const hoverRef = useRef<GlobeFeature | null>(null);
  const interactingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [polygons, setPolygons] = useState<GlobeFeature[]>([]);

  const allCountries = useMemo(() => getAllHighlightCountries(), []);
  const allStates = useMemo(() => getAllHighlightStates(), []);
  const regionCountries = useMemo(
    () => getRegionHighlightCountries(region),
    [region]
  );
  const regionStates = useMemo(
    () => getRegionHighlightStates(region),
    [region]
  );
  const pinCountries = useMemo(
    () => (activePin ? getPinHighlightCountries(activePin) : new Set<string>()),
    [activePin]
  );
  const pinStates = useMemo(
    () => (activePin ? getPinHighlightStates(activePin) : new Set<string>()),
    [activePin]
  );

  const toneOf = (d: GlobeFeature) => {
    if (d.__kind === "country") {
      if (pinCountries.has(d.__key)) return "selected" as const;
      if (regionCountries.has(d.__key)) return "region" as const;
      if (allCountries.has(d.__key)) return "work" as const;
      return "dim" as const;
    }
    if (pinStates.has(d.__key)) return "selected" as const;
    if (regionStates.has(d.__key)) return "region" as const;
    if (allStates.has(d.__key)) return "work" as const;
    return "dim" as const;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadGeo() {
      const [countriesTopo, statesTopo] = await Promise.all([
        fetch("/geo/countries-110m.json").then((r) => r.json()) as Promise<Topology>,
        fetch("/geo/states-10m.json").then((r) => r.json()) as Promise<Topology>,
      ]);

      const countriesFc = feature(
        countriesTopo,
        countriesTopo.objects.countries as GeometryCollection
      ) as FeatureCollection;

      const statesFc = feature(
        statesTopo,
        statesTopo.objects.states as GeometryCollection
      ) as FeatureCollection;

      const countryFeatures: GlobeFeature[] = countriesFc.features
        .map((f) => {
          const n = typeof f.id === "string" ? Number(f.id) : Number(f.id);
          const iso =
            ISO_BY_NUMERIC[n] ??
            String((f.properties as { name?: string })?.name ?? "");
          return {
            ...f,
            __kind: "country" as const,
            __key: iso,
            properties: { ...(f.properties ?? {}), ISO_A3: iso },
          };
        })
        .filter((f) => f.__key !== "USA");

      const stateFeatures: GlobeFeature[] = statesFc.features.map((f) => {
        const name = String(
          (f.properties as { name?: string })?.name ?? f.id ?? ""
        );
        return {
          ...f,
          __kind: "state" as const,
          __key: name,
          properties: { ...(f.properties ?? {}), name },
        };
      });

      if (!cancelled) setPolygons([...countryFeatures, ...stateFeatures]);
    }

    loadGeo().catch(() => {
      if (!cancelled) setPolygons([]);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let onStart: (() => void) | null = null;
    let onEnd: (() => void) | null = null;
    let endTimer: number | undefined;

    async function boot() {
      await loadScript("/vendor/globe.gl.min.js");
      if (cancelled || !mountRef.current || !window.Globe) return;

      mountRef.current.innerHTML = "";
      const globe = window.Globe()(mountRef.current)
        .width(width)
        .height(height)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl(
          "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
        )
        .bumpImageUrl(
          "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
        )
        .atmosphereColor("#e07828")
        .atmosphereAltitude(0.18)
        .showGraticules(false)
        .polygonsTransitionDuration(280);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.55;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 140;
      controls.maxDistance = 450;

      onStart = () => {
        interactingRef.current = true;
        controls.autoRotate = false;
        if (endTimer) window.clearTimeout(endTimer);
      };
      onEnd = () => {
        interactingRef.current = false;
        endTimer = window.setTimeout(() => {
          if (!interactingRef.current) controls.autoRotate = true;
        }, 2200);
      };
      controls.addEventListener("start", onStart);
      controls.addEventListener("end", onEnd);

      globeRef.current = globe;
      setReady(true);
    }

    boot().catch(() => undefined);

    return () => {
      cancelled = true;
      if (endTimer) window.clearTimeout(endTimer);
      const globe = globeRef.current;
      if (globe && onStart && onEnd) {
        try {
          const controls = globe.controls();
          controls.removeEventListener("start", onStart);
          controls.removeEventListener("end", onEnd);
        } catch {
          /* ignore */
        }
      }
      if (globe?._destructor) globe._destructor();
      globeRef.current = null;
      setReady(false);
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
    // Recreate only when mount is first ready; size updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;
    globe.width(width).height(height);
  }, [width, height, ready]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;

    const paint = () => {
      globe
        .polygonCapColor((d) => {
          const feat = d as GlobeFeature;
          const tone = toneOf(feat);
          if (hoverRef.current === feat) {
            return tone === "dim"
              ? "rgba(90, 110, 140, 0.45)"
              : COLOR.selected;
          }
          return COLOR[tone];
        })
        .polygonSideColor(() => COLOR.side)
        .polygonStrokeColor(() => COLOR.stroke)
        .polygonAltitude((d) => {
          const feat = d as GlobeFeature;
          const tone = toneOf(feat);
          if (hoverRef.current === feat) return 0.07;
          if (tone === "selected") return 0.055;
          if (tone === "region") return 0.04;
          if (tone === "work") return 0.025;
          return 0.006;
        });
    };

    globe
      .polygonsData(polygons)
      .polygonLabel((d) => {
        const feat = d as GlobeFeature;
        const name =
          feat.__kind === "state"
            ? String(feat.properties.name ?? feat.__key)
            : String((feat.properties as { name?: string }).name ?? feat.__key);
        const tone = toneOf(feat);
        if (tone === "dim") return name;
        return `${name}<br/><span style="opacity:.75">Exhibium project market</span>`;
      })
      .onPolygonHover((d) => {
        hoverRef.current = (d as GlobeFeature) || null;
        paint();
      });

    paint();
  }, [
    polygons,
    ready,
    region,
    activePin,
    pinCountries,
    pinStates,
    regionCountries,
    regionStates,
    allCountries,
    allStates,
  ]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;
    const market = activePin ? getMarketHighlight(activePin) : null;
    const view = market?.focus ?? regionFocus[region];
    globe.pointOfView(view, 1100);
  }, [region, activePin, ready]);

  return <div className="atlas-globe-canvas" ref={mountRef} />;
}
