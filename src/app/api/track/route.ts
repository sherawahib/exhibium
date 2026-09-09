import { NextResponse } from "next/server";
import { upsertVisitor } from "@/lib/db";
import { clientIp, lookupGeo } from "@/lib/geo";

function normalizeEmail(value: unknown) {
  const email = String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, 200);
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      visitorId?: number;
      email?: string;
    };

    const ip = clientIp(request);
    const ua = request.headers.get("user-agent") || "";
    const pagePath = String(body.path || "/").slice(0, 300);
    const email = normalizeEmail(body.email);
    const geo = await lookupGeo(ip);

    const result = await upsertVisitor({
      visitorId: body.visitorId,
      ip,
      path: pagePath,
      userAgent: ua,
      email,
      geo,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("track error", err);
    return NextResponse.json({ error: "track failed" }, { status: 500 });
  }
}
