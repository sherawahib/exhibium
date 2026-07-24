import type { RegionId } from "@/lib/projects";

/** Country ISO A3 codes (Natural Earth / world-atlas). */
export type CountryCode = string;
/** US state names as in us-atlas TopoJSON. */
export type UsStateName = string;

export type MarketHighlight = {
  pinId: string;
  region: RegionId;
  countries: CountryCode[];
  states: UsStateName[];
  focus: { lat: number; lng: number; altitude: number };
};

/**
 * Maps each project market pin to full countries / US states to paint on the globe.
 * USA work is highlighted at state level (not the entire country).
 */
export const marketHighlights: MarketHighlight[] = [
  {
    pinId: "usa-west",
    region: "usa",
    countries: [],
    states: ["California", "Oregon", "Washington", "Nevada", "Arizona"],
    focus: { lat: 37.5, lng: -119.5, altitude: 1.55 },
  },
  {
    pinId: "usa-midwest",
    region: "usa",
    countries: [],
    states: [
      "Illinois",
      "Indiana",
      "Ohio",
      "Michigan",
      "Wisconsin",
      "Minnesota",
    ],
    focus: { lat: 41.5, lng: -87.5, altitude: 1.7 },
  },
  {
    pinId: "usa-nyc",
    region: "usa",
    countries: [],
    states: ["New York", "New Jersey"],
    focus: { lat: 41.2, lng: -74.2, altitude: 1.45 },
  },
  {
    pinId: "usa-fl",
    region: "usa",
    countries: [],
    states: ["Florida"],
    focus: { lat: 27.8, lng: -81.5, altitude: 1.5 },
  },
  {
    pinId: "mexico",
    region: "latam",
    countries: ["MEX"],
    states: [],
    focus: { lat: 23.5, lng: -102.5, altitude: 1.75 },
  },
  {
    pinId: "central",
    region: "latam",
    countries: ["SLV", "PAN", "CRI"],
    states: [],
    focus: { lat: 10.5, lng: -84.5, altitude: 1.55 },
  },
  {
    pinId: "caribbean",
    region: "latam",
    countries: ["DOM"],
    states: [],
    focus: { lat: 18.7, lng: -70.2, altitude: 1.45 },
  },
  {
    pinId: "colombia",
    region: "latam",
    countries: ["COL"],
    states: [],
    focus: { lat: 4.5, lng: -74.0, altitude: 1.65 },
  },
  {
    pinId: "venezuela",
    region: "latam",
    countries: ["VEN"],
    states: [],
    focus: { lat: 7.0, lng: -66.0, altitude: 1.65 },
  },
  {
    pinId: "ecuador",
    region: "latam",
    countries: ["ECU"],
    states: [],
    focus: { lat: -1.5, lng: -78.5, altitude: 1.55 },
  },
  {
    pinId: "peru",
    region: "latam",
    countries: ["PER"],
    states: [],
    focus: { lat: -9.5, lng: -75.0, altitude: 1.7 },
  },
  {
    pinId: "bolivia",
    region: "latam",
    countries: ["BOL"],
    states: [],
    focus: { lat: -16.5, lng: -64.5, altitude: 1.65 },
  },
  {
    pinId: "chile",
    region: "latam",
    countries: ["CHL"],
    states: [],
    focus: { lat: -30.0, lng: -71.0, altitude: 1.85 },
  },
  {
    pinId: "ksa",
    region: "mena",
    countries: ["SAU"],
    states: [],
    focus: { lat: 24.0, lng: 45.0, altitude: 1.7 },
  },
  {
    pinId: "doha",
    region: "mena",
    countries: ["QAT"],
    states: [],
    focus: { lat: 25.3, lng: 51.5, altitude: 1.35 },
  },
  {
    pinId: "uae",
    region: "mena",
    countries: ["ARE"],
    states: [],
    focus: { lat: 24.3, lng: 54.5, altitude: 1.4 },
  },
  {
    pinId: "russia",
    region: "mena",
    countries: ["RUS"],
    states: [],
    focus: { lat: 55.0, lng: 45.0, altitude: 2.1 },
  },
];

export const regionFocus: Record<
  RegionId,
  { lat: number; lng: number; altitude: number }
> = {
  usa: { lat: 37, lng: -97, altitude: 1.85 },
  latam: { lat: 5, lng: -78, altitude: 2.05 },
  mena: { lat: 28, lng: 48, altitude: 1.95 },
};

export function getMarketHighlight(pinId: string) {
  return marketHighlights.find((m) => m.pinId === pinId);
}

/** All countries that have Exhibium work (for base coloring). */
export function getAllHighlightCountries(): Set<string> {
  const set = new Set<string>();
  for (const m of marketHighlights) {
    for (const c of m.countries) set.add(c);
  }
  return set;
}

export function getAllHighlightStates(): Set<string> {
  const set = new Set<string>();
  for (const m of marketHighlights) {
    for (const s of m.states) set.add(s);
  }
  return set;
}

export function getRegionHighlightCountries(region: RegionId): Set<string> {
  const set = new Set<string>();
  for (const m of marketHighlights) {
    if (m.region !== region) continue;
    for (const c of m.countries) set.add(c);
  }
  return set;
}

export function getRegionHighlightStates(region: RegionId): Set<string> {
  const set = new Set<string>();
  for (const m of marketHighlights) {
    if (m.region !== region) continue;
    for (const s of m.states) set.add(s);
  }
  return set;
}

export function getPinHighlightCountries(pinId: string): Set<string> {
  const m = getMarketHighlight(pinId);
  return new Set(m?.countries ?? []);
}

export function getPinHighlightStates(pinId: string): Set<string> {
  const m = getMarketHighlight(pinId);
  return new Set(m?.states ?? []);
}

/** Approximate centroids for project US states (labels on the globe). */
export const stateLabelCenters: Record<
  string,
  { lat: number; lng: number }
> = {
  California: { lat: 36.8, lng: -119.4 },
  Oregon: { lat: 43.9, lng: -120.6 },
  Washington: { lat: 47.4, lng: -120.5 },
  Nevada: { lat: 39.3, lng: -116.6 },
  Arizona: { lat: 34.3, lng: -111.7 },
  Illinois: { lat: 40.0, lng: -89.2 },
  Indiana: { lat: 39.9, lng: -86.3 },
  Ohio: { lat: 40.3, lng: -82.8 },
  Michigan: { lat: 44.3, lng: -85.4 },
  Wisconsin: { lat: 44.5, lng: -89.7 },
  Minnesota: { lat: 46.0, lng: -94.3 },
  "New York": { lat: 42.9, lng: -75.5 },
  "New Jersey": { lat: 40.1, lng: -74.6 },
  Florida: { lat: 28.1, lng: -81.7 },
};

export type StateLabel = {
  name: string;
  lat: number;
  lng: number;
};

export function getWorkStateLabels(): StateLabel[] {
  return [...getAllHighlightStates()]
    .map((name) => {
      const center = stateLabelCenters[name];
      if (!center) return null;
      return { name, lat: center.lat, lng: center.lng };
    })
    .filter((x): x is StateLabel => x !== null);
}
