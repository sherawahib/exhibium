import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ensureDb, getDb } from "@/lib/db";
import { clientIp } from "@/lib/geo";

/** Visitor: create thread / send message / poll messages */
export async function POST(request: Request) {
  await ensureDb();
  const db = getDb();
  const body = (await request.json()) as {
    action?: string;
    threadId?: string;
    message?: string;
    visitorLabel?: string;
  };

  const action = body.action || "send";
  const now = new Date().toISOString();
  const ip = clientIp(request);

  if (action === "start") {
    const id = randomUUID();
    const label = String(body.visitorLabel || "Visitor").slice(0, 40);
    await db.execute({
      sql: `INSERT INTO chat_threads (id, visitor_label, visitor_ip, status, created_at, updated_at)
            VALUES (?, ?, ?, 'open', ?, ?)`,
      args: [id, label, ip, now, now],
    });
    await db.execute({
      sql: `INSERT INTO chat_messages (thread_id, sender, body, created_at)
            VALUES (?, 'admin', ?, ?)`,
      args: [
        id,
        "Welcome to Exhibium live chat. An advisor will respond shortly.",
        now,
      ],
    });
    return NextResponse.json({ threadId: id });
  }

  if (action === "send") {
    const threadId = String(body.threadId || "");
    const message = String(body.message || "").trim().slice(0, 2000);
    if (!threadId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const thread = await db.execute({
      sql: `SELECT id FROM chat_threads WHERE id = ?`,
      args: [threadId],
    });
    if (!thread.rows.length) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    await db.execute({
      sql: `INSERT INTO chat_messages (thread_id, sender, body, created_at) VALUES (?, 'visitor', ?, ?)`,
      args: [threadId, message, now],
    });
    await db.execute({
      sql: `UPDATE chat_threads SET updated_at = ?, status = 'open' WHERE id = ?`,
      args: [now, threadId],
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET(request: Request) {
  await ensureDb();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "threadId required" }, { status: 400 });
  }

  const result = await db.execute({
    sql: `SELECT id, thread_id, sender, body, created_at FROM chat_messages
          WHERE thread_id = ? ORDER BY created_at ASC, id ASC`,
    args: [threadId],
  });

  const messages = result.rows.map((r) => ({
    id: Number(r.id),
    threadId: String(r.thread_id),
    sender: String(r.sender) as "visitor" | "admin",
    body: String(r.body),
    createdAt: String(r.created_at),
  }));

  return NextResponse.json({ messages });
}
