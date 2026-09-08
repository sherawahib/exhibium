import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ensureDb, getDb } from "@/lib/db";
import { clientIp } from "@/lib/geo";

async function getMessages(threadId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, thread_id, sender, body, created_at FROM chat_messages
          WHERE thread_id = ? ORDER BY created_at ASC, id ASC`,
    args: [threadId],
  });
  return result.rows.map((r) => ({
    id: Number(r.id),
    threadId: String(r.thread_id),
    sender: String(r.sender) as "visitor" | "admin",
    body: String(r.body),
    createdAt: String(r.created_at),
  }));
}

async function getTyping(threadId: string) {
  const db = getDb();
  const cutoff = new Date(Date.now() - 3000).toISOString();
  const result = await db.execute({
    sql: `SELECT sender FROM chat_typing
          WHERE thread_id = ? AND updated_at > ?`,
    args: [threadId, cutoff],
  });
  const senders = new Set(result.rows.map((r) => String(r.sender)));
  return {
    visitor: senders.has("visitor"),
    admin: senders.has("admin"),
  };
}

/** Visitor: create thread / send / typing / poll */
export async function POST(request: Request) {
  await ensureDb();
  const db = getDb();
  const body = (await request.json()) as {
    action?: string;
    threadId?: string;
    message?: string;
    visitorLabel?: string;
    typing?: boolean;
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
        "Hi — welcome to Exhibium. How can we help with BIM, modular, or market entry today?",
        now,
      ],
    });
    const messages = await getMessages(id);
    return NextResponse.json({ threadId: id, messages });
  }

  if (action === "typing") {
    const threadId = String(body.threadId || "");
    if (!threadId) {
      return NextResponse.json({ error: "Missing thread" }, { status: 400 });
    }
    if (body.typing) {
      await db.execute({
        sql: `INSERT INTO chat_typing (thread_id, sender, updated_at) VALUES (?, 'visitor', ?)
              ON CONFLICT(thread_id, sender) DO UPDATE SET updated_at = excluded.updated_at`,
        args: [threadId, now],
      });
    } else {
      await db.execute({
        sql: `DELETE FROM chat_typing WHERE thread_id = ? AND sender = 'visitor'`,
        args: [threadId],
      });
    }
    return NextResponse.json({ ok: true });
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
    const inserted = await db.execute({
      sql: `INSERT INTO chat_messages (thread_id, sender, body, created_at) VALUES (?, 'visitor', ?, ?)`,
      args: [threadId, message, now],
    });
    await db.execute({
      sql: `UPDATE chat_threads SET updated_at = ?, status = 'open' WHERE id = ?`,
      args: [now, threadId],
    });
    await db.execute({
      sql: `DELETE FROM chat_typing WHERE thread_id = ? AND sender = 'visitor'`,
      args: [threadId],
    });
    const msg = {
      id: Number(inserted.lastInsertRowid),
      threadId,
      sender: "visitor" as const,
      body: message,
      createdAt: now,
    };
    return NextResponse.json({
      ok: true,
      message: msg,
      messages: await getMessages(threadId),
      typing: await getTyping(threadId),
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET(request: Request) {
  await ensureDb();
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "threadId required" }, { status: 400 });
  }

  return NextResponse.json({
    messages: await getMessages(threadId),
    typing: await getTyping(threadId),
  });
}
