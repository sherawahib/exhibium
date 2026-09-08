import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureDb, getDb } from "@/lib/db";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");

  if (threadId) {
    const messages = await db.execute({
      sql: `SELECT id, thread_id, sender, body, created_at FROM chat_messages
            WHERE thread_id = ? ORDER BY created_at ASC, id ASC`,
      args: [threadId],
    });
    return NextResponse.json({
      messages: messages.rows.map((r) => ({
        id: Number(r.id),
        threadId: String(r.thread_id),
        sender: String(r.sender),
        body: String(r.body),
        createdAt: String(r.created_at),
      })),
    });
  }

  const threads = await db.execute({
    sql: `SELECT t.*,
            (SELECT body FROM chat_messages m WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1) AS last_message
          FROM chat_threads t
          ORDER BY t.updated_at DESC
          LIMIT 200`,
    args: [],
  });

  return NextResponse.json({
    threads: threads.rows.map((r) => ({
      id: String(r.id),
      visitorLabel: String(r.visitor_label),
      visitorIp: (r.visitor_ip as string) || null,
      status: String(r.status),
      createdAt: String(r.created_at),
      updatedAt: String(r.updated_at),
      lastMessage: (r.last_message as string) || null,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();
  const body = (await request.json()) as {
    threadId?: string;
    message?: string;
    status?: string;
  };

  const threadId = String(body.threadId || "");
  const now = new Date().toISOString();

  if (body.status && threadId) {
    await db.execute({
      sql: `UPDATE chat_threads SET status = ?, updated_at = ? WHERE id = ?`,
      args: [body.status, now, threadId],
    });
    return NextResponse.json({ ok: true });
  }

  const message = String(body.message || "").trim().slice(0, 2000);
  if (!threadId || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await db.execute({
    sql: `INSERT INTO chat_messages (thread_id, sender, body, created_at) VALUES (?, 'admin', ?, ?)`,
    args: [threadId, message, now],
  });
  await db.execute({
    sql: `UPDATE chat_threads SET updated_at = ?, status = 'open' WHERE id = ?`,
    args: [now, threadId],
  });

  return NextResponse.json({ ok: true });
}
