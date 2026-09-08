import { NextResponse } from "next/server";
import { ensureDb, getDb, nextVisitorNumber } from "@/lib/db";
import { clientIp, lookupGeo } from "@/lib/geo";

export async function POST(request: Request) {
  try {
    await ensureDb();
    const db = getDb();
    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      visitorId?: number;
    };

    const ip = clientIp(request);
    const ua = request.headers.get("user-agent") || "";
    const pagePath = String(body.path || "/").slice(0, 300);
    const now = new Date().toISOString();

    if (body.visitorId) {
      const existing = await db.execute({
        sql: `SELECT id FROM visitors WHERE id = ?`,
        args: [body.visitorId],
      });
      if (existing.rows.length) {
        await db.execute({
          sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ? WHERE id = ?`,
          args: [now, pagePath, ua, body.visitorId],
        });
        return NextResponse.json({ id: body.visitorId });
      }
    }

    // Reuse same IP within 12 hours as same visitor label
    const recent = await db.execute({
      sql: `SELECT id, label FROM visitors
            WHERE ip = ? AND last_seen_at > ?
            ORDER BY last_seen_at DESC LIMIT 1`,
      args: [
        ip,
        new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      ],
    });

    if (recent.rows.length) {
      const id = Number(recent.rows[0].id);
      await db.execute({
        sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ? WHERE id = ?`,
        args: [now, pagePath, ua, id],
      });
      return NextResponse.json({ id, label: recent.rows[0].label });
    }

    const geo = await lookupGeo(ip);
    const num = await nextVisitorNumber();
    const label = `User ${num}`;

    const inserted = await db.execute({
      sql: `INSERT INTO visitors
        (label, ip, country, region, city, latitude, longitude, user_agent, path, created_at, last_seen_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        label,
        ip,
        geo.country,
        geo.region,
        geo.city,
        geo.latitude,
        geo.longitude,
        ua,
        pagePath,
        now,
        now,
      ],
    });

    return NextResponse.json({
      id: Number(inserted.lastInsertRowid),
      label,
    });
  } catch (err) {
    console.error("track error", err);
    return NextResponse.json({ error: "track failed" }, { status: 500 });
  }
}
