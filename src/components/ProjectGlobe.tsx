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
  getRegionHighlightCountries,
  getRegionHighlightStates,
  getWorkStateLabels,
  regionFocus,
  type StateLabel,
} from "@/lib/globeHighlights";

type GlobeFeature = Feature<Geometry> & {
  properties: Record<string, unknown>;
  __kind: "country" | "state";
  __key: string;
};

type HighlightSets = {
  pinCountries: Set<string>;
  pinStates: Set<string>;
  regionCountries: Set<string>;
  regionStates: Set<string>;
};

type GlobeInstance = {
  (el: HTMLElement): GlobeInstance;
  width: (n: number) => GlobeInstance;
  height: (n: number) => GlobeInstance;
  backgroundColor: (c: string) => GlobeInstance;
  globeImageUrl: (u: string) => GlobeInstance;
  atmosphereColor: (c: string) => GlobeInstance;
  atmosphereAltitude: (n: number) => GlobeInstance;
  showGraticules: (v: boolean) => GlobeInstance;
  polygonsData: (d: object[]) => GlobeInstance;
  polygonCapColor: (fn: (d: object) => string) => GlobeInstance;
  polygonSideColor: (fn: (d: object) => string) => GlobeInstance;
  polygonStrokeColor: (fn: (d: object) => string) => GlobeInstance;
  polygonAltitude: (fn: (d: object) => number) => GlobeInstance;
  polygonsTransitionDuration: (n: number) => GlobeInstance;
  labelsData: (d: object[]) => GlobeInstance;
  labelLat: (v: string | ((d: object) => number)) => GlobeInstance;
  labelLng: (v: string | ((d: object) => number)) => GlobeInstance;
  labelText: (v: string | ((d: object) => string)) => GlobeInstance;
  labelSize: (v: number | ((d: object) => number)) => GlobeInstance;
  labelColor: (v: string | ((d: object) => string)) => GlobeInstance;
  labelAltitude: (v: number | ((d: object) => number)) => GlobeInstance;
  labelDotRadius: (v: number | ((d: object) => number)) => GlobeInstance;
  labelResolution: (n: number) => GlobeInstance;
  labelIncludeDot: (v: boolean | ((d: object) => boolean)) => GlobeInstance;
  htmlElementsData: (d: object[]) => GlobeInstance;
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
    enableZoom: boolean;
    addEventListener: (type: string, fn: () => void) => void;
    removeEventListener: (type: string, fn: () => void) => void;
  };
  renderer?: () => { setPixelRatio: (n: number) => void };
  _destructor?: () => void;
};

type Props = {
  region: RegionId;
  activePin: string | null;
  width: number;
  height: number;
};

const COLOR = {
  work: "rgba(196, 112, 48, 0.62)",
  region: "rgba(224, 120, 40, 0.88)",
  selected: "rgba(255, 196, 120, 0.96)",
  side: "rgba(8, 16, 32, 0.28)",
  stroke: "rgba(12, 22, 40, 0.4)",
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

function toneOf(d: GlobeFeature, h: HighlightSets) {
  if (d.__kind === "country") {
    if (h.pinCountries.has(d.__key)) return "selected" as const;
    if (h.regionCountries.has(d.__key)) return "region" as const;
    return "work" as const;
  }
  if (h.pinStates.has(d.__key)) return "selected" as const;
  if (h.regionStates.has(d.__key)) return "region" as const;
  return "work" as const;
}

function applyHighlightStyle(globe: GlobeInstance, h: HighlightSets) {
  globe
    .polygonCapColor((d) => COLOR[toneOf(d as GlobeFeature, h)])
    .polygonAltitude((d) => {
      const tone = toneOf(d as GlobeFeature, h);
      if (tone === "selected") return 0.04;
      if (tone === "region") return 0.028;
      return 0.016;
    })
    .labelSize((d) => {
      const name = String((d as StateLabel).name);
      if (h.pinStates.has(name)) return 1.35;
      if (h.regionStates.has(name)) return 1.15;
      return 0.9;
    })
    .labelColor((d) => {
      const name = String((d as StateLabel).name);
      if (h.pinStates.has(name)) return "#fff8ef";
      if (h.regionStates.has(name)) return "#ffe2b8";
      return "rgba(255, 232, 200, 0.88)";
    })
    .labelAltitude((d) => {
      const name = String((d as StateLabel).name);
      if (h.pinStates.has(name)) return 0.09;
      if (h.regionStates.has(name)) return 0.075;
      return 0.06;
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
  const highlightRef = useRef<HighlightSets>({
    pinCountries: new Set(),
    pinStates: new Set(),
    regionCountries: new Set(),
    regionStates: new Set(),
  });
  const polygonsReadyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [polygons, setPolygons] = useState<GlobeFeature[]>([]);
  const stateLabels = useMemo(() => getWorkStateLabels(), []);

  useEffect(() => {
    const market = activePin ? getMarketHighlight(activePin) : null;
    highlightRef.current = {
      pinCountries: new Set(market?.countries ?? []),
      pinStates: new Set(market?.states ?? []),
      regionCountries: getRegionHighlightCountries(region),
      regionStates: getRegionHighlightStates(region),
    };

    const globe = globeRef.current;
    if (globe && polygonsReadyRef.current) {
      // Labels only when viewing USA — fewer meshes elsewhere.
      globe.labelsData(region === "usa" ? stateLabels : []);
      applyHighlightStyle(globe, highlightRef.current);
    }
  }, [region, activePin, stateLabels]);

  useEffect(() => {
    let cancelled = false;

    async function loadGeo() {
      const [countriesTopo, statesTopo] = await Promise.all([
        fetch("/geo/countries-110m.json").then((r) => r.json()) as Promise<Topology>,
        fetch("/geo/states-10m.json").then((r) => r.json()) as Promise<Topology>,
      ]);
      if (cancelled) return;

      const workCountries = getAllHighlightCountries();
      const workStates = getAllHighlightStates();

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
          const iso = ISO_BY_NUMERIC[n] ?? "";
          return {
            ...f,
            __kind: "country" as const,
            __key: iso,
            properties: { ...(f.properties ?? {}), ISO_A3: iso },
          };
        })
        .filter((f) => workCountries.has(f.__key));

      const stateFeatures: GlobeFeature[] = statesFc.features
        .map((f) => {
          const name = String(
            (f.properties as { name?: string })?.name ?? f.id ?? ""
          );
          return {
            ...f,
            __kind: "state" as const,
            __key: name,
            properties: { ...(f.properties ?? {}), name },
          };
        })
        .filter((f) => workStates.has(f.__key));

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
    let visibilityObserver: IntersectionObserver | null = null;

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
        .atmosphereColor("#e07828")
        .atmosphereAltitude(0.12)
        .showGraticules(false)
        .polygonsTransitionDuration(0)
        .htmlElementsData([]);

      try {
        globe
          .renderer?.()
          .setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      } catch {
        /* ignore */
      }

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableDamping = true;
      controls.dampingFactor = 0.12;
      controls.minDistance = 160;
      controls.maxDistance = 420;
      controls.enableZoom = true;

      onStart = () => {
        controls.autoRotate = false;
        if (endTimer) window.clearTimeout(endTimer);
      };
      onEnd = () => {
        endTimer = window.setTimeout(() => {
          controls.autoRotate = true;
        }, 1800);
      };
      controls.addEventListener("start", onStart);
      controls.addEventListener("end", onEnd);

      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          controls.autoRotate = entry.isIntersecting;
        },
        { threshold: 0.12 }
      );
      visibilityObserver.observe(mountRef.current);

      globeRef.current = globe;
      setReady(true);
    }

    boot().catch(() => undefined);

    return () => {
      cancelled = true;
      if (endTimer) window.clearTimeout(endTimer);
      visibilityObserver?.disconnect();
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
      polygonsReadyRef.current = false;
      setReady(false);
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;
    globe.width(width).height(height);
  }, [width, height, ready]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready || polygons.length === 0) return;

    globe
      .polygonsData(polygons)
      .polygonSideColor(() => COLOR.side)
      .polygonStrokeColor(() => COLOR.stroke)
      .labelsData(highlightRef.current.regionStates.size ? stateLabels : [])
      .labelLat("lat")
      .labelLng("lng")
      .labelText("name")
      .labelIncludeDot(false)
      .labelDotRadius(0)
      .labelResolution(2);

    applyHighlightStyle(globe, highlightRef.current);
    polygonsReadyRef.current = true;
    // region handled via highlight effect — avoid rebuilding meshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygons, ready, stateLabels]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;
    const market = activePin ? getMarketHighlight(activePin) : null;
    const view = market?.focus ?? regionFocus[region];
    globe.pointOfView(view, 800);
  }, [region, activePin, ready]);

  return <div className="atlas-globe-canvas" ref={mountRef} />;
}
