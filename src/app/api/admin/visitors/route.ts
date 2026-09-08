import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureDb, getDb, type VisitorRow } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM visitors ORDER BY last_seen_at DESC LIMIT 500`,
    args: [],
  });

  const visitors = result.rows.map((r) => ({
    id: Number(r.id),
    label: String(r.label),
    ip: String(r.ip),
    country: (r.country as string) || null,
    region: (r.region as string) || null,
    city: (r.city as string) || null,
    latitude: r.latitude == null ? null : Number(r.latitude),
    longitude: r.longitude == null ? null : Number(r.longitude),
    user_agent: (r.user_agent as string) || null,
    path: (r.path as string) || null,
    created_at: String(r.created_at),
    last_seen_at: String(r.last_seen_at),
  })) satisfies VisitorRow[];

  return NextResponse.json({ visitors });
}
