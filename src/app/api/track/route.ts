import { NextResponse } from "next/server";
import { ensureDb, getDb, nextVisitorNumber } from "@/lib/db";
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
    await ensureDb();
    const db = getDb();
    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      visitorId?: number;
      email?: string;
    };

    const ip = clientIp(request);
    const ua = request.headers.get("user-agent") || "";
    const pagePath = String(body.path || "/").slice(0, 300);
    const email = normalizeEmail(body.email);
    const now = new Date().toISOString();

    if (body.visitorId) {
      const existing = await db.execute({
        sql: `SELECT id, email FROM visitors WHERE id = ?`,
        args: [body.visitorId],
      });
      if (existing.rows.length) {
        if (email) {
          await db.execute({
            sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ?, email = ? WHERE id = ?`,
            args: [now, pagePath, ua, email, body.visitorId],
          });
        } else {
          await db.execute({
            sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ? WHERE id = ?`,
            args: [now, pagePath, ua, body.visitorId],
          });
        }
        return NextResponse.json({
          id: body.visitorId,
          email: email || (existing.rows[0].email as string) || null,
        });
      }
    }

    const recent = await db.execute({
      sql: `SELECT id, label, email FROM visitors
            WHERE ip = ? AND last_seen_at > ?
            ORDER BY last_seen_at DESC LIMIT 1`,
      args: [
        ip,
        new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      ],
    });

    if (recent.rows.length) {
      const id = Number(recent.rows[0].id);
      if (email) {
        await db.execute({
          sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ?, email = ? WHERE id = ?`,
          args: [now, pagePath, ua, email, id],
        });
      } else {
        await db.execute({
          sql: `UPDATE visitors SET last_seen_at = ?, path = ?, user_agent = ? WHERE id = ?`,
          args: [now, pagePath, ua, id],
        });
      }
      return NextResponse.json({
        id,
        label: recent.rows[0].label,
        email: email || (recent.rows[0].email as string) || null,
      });
    }

    const geo = await lookupGeo(ip);
    const num = await nextVisitorNumber();
    const label = `User ${num}`;

    const inserted = await db.execute({
      sql: `INSERT INTO visitors
        (label, ip, email, country, region, city, latitude, longitude, user_agent, path, created_at, last_seen_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        label,
        ip,
        email,
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
      email,
    });
  } catch (err) {
    console.error("track error", err);
    return NextResponse.json({ error: "track failed" }, { status: 500 });
  }
}
