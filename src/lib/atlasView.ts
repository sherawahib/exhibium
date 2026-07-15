import type { RegionId } from "@/lib/projects";
import { projectToPercent } from "@/lib/projects";

export type AtlasView = {
  lat: number;
  lon: number;
  zoom: number;
};

/** Default Americas-centered framing (most projects live here). */
export const americasView: AtlasView = {
  lat: 18,
  lon: -88,
  zoom: 2.65,
};

export const regionViews: Record<RegionId, AtlasView> = {
  usa: { lat: 34, lon: -95, zoom: 3.05 },
  latam: { lat: 4, lon: -78, zoom: 2.7 },
  mena: { lat: 27, lon: 48, zoom: 3.15 },
};

export function viewForPin(
  lat: number,
  lon: number,
  baseZoom = 3.55
): AtlasView {
  return { lat, lon, zoom: baseZoom };
}

/** CSS transform that centers (lat,lon) in the viewport at the given zoom. */
export function atlasTransform(view: AtlasView) {
  const { left, top } = projectToPercent(view.lat, view.lon);
  const z = view.zoom;
  return {
    transform: `translate(calc(50% - ${left * z}%), calc(50% - ${top * z}%)) scale(${z})`,
  };
}
