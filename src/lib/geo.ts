export type GeoInfo = {
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function clientIp(request: Request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function lookupGeo(ip: string): Promise<GeoInfo> {
  const empty: GeoInfo = {
    country: null,
    region: null,
    city: null,
    latitude: null,
    longitude: null,
  };

  if (
    !ip ||
    ip === "unknown" ||
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.")
  ) {
    return {
      country: "Local",
      region: "Development",
      city: "Localhost",
      latitude: 25.7617,
      longitude: -80.1918,
    };
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,lat,lon`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return empty;
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      regionName?: string;
      city?: string;
      lat?: number;
      lon?: number;
    };
    if (data.status !== "success") return empty;
    return {
      country: data.country || null,
      region: data.regionName || null,
      city: data.city || null,
      latitude: typeof data.lat === "number" ? data.lat : null,
      longitude: typeof data.lon === "number" ? data.lon : null,
    };
  } catch {
    return empty;
  }
}
