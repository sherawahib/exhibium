import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureDb, getDb } from "@/lib/db";

async function getMessages(threadId: string) {
  const db = getDb();
  const messages = await db.execute({
    sql: `SELECT id, thread_id, sender, body, created_at FROM chat_messages
          WHERE thread_id = ? ORDER BY created_at ASC, id ASC`,
    args: [threadId],
  });
  return messages.rows.map((r) => ({
    id: Number(r.id),
    threadId: String(r.thread_id),
    sender: String(r.sender),
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

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");

  if (threadId) {
    return NextResponse.json({
      messages: await getMessages(threadId),
      typing: await getTyping(threadId),
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
    action?: string;
    typing?: boolean;
  };

  const threadId = String(body.threadId || "");
  const now = new Date().toISOString();

  if (body.action === "typing" && threadId) {
    if (body.typing) {
      await db.execute({
        sql: `INSERT INTO chat_typing (thread_id, sender, updated_at) VALUES (?, 'admin', ?)
              ON CONFLICT(thread_id, sender) DO UPDATE SET updated_at = excluded.updated_at`,
        args: [threadId, now],
      });
    } else {
      await db.execute({
        sql: `DELETE FROM chat_typing WHERE thread_id = ? AND sender = 'admin'`,
        args: [threadId],
      });
    }
    return NextResponse.json({ ok: true });
  }

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

  const inserted = await db.execute({
    sql: `INSERT INTO chat_messages (thread_id, sender, body, created_at) VALUES (?, 'admin', ?, ?)`,
    args: [threadId, message, now],
  });
  await db.execute({
    sql: `UPDATE chat_threads SET updated_at = ?, status = 'open' WHERE id = ?`,
    args: [now, threadId],
  });
  await db.execute({
    sql: `DELETE FROM chat_typing WHERE thread_id = ? AND sender = 'admin'`,
    args: [threadId],
  });

  return NextResponse.json({
    ok: true,
    message: {
      id: Number(inserted.lastInsertRowid),
      threadId,
      sender: "admin",
      body: message,
      createdAt: now,
    },
    messages: await getMessages(threadId),
    typing: await getTyping(threadId),
  });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    ids?: string[];
    id?: string;
  };

  const ids = [
    ...(body.ids || []),
    ...(body.id ? [body.id] : []),
  ]
    .map((id) => String(id || "").trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json({ error: "No chats selected" }, { status: 400 });
  }

  await ensureDb();
  const db = getDb();
  const placeholders = ids.map(() => "?").join(",");

  await db.execute({
    sql: `DELETE FROM chat_messages WHERE thread_id IN (${placeholders})`,
    args: ids,
  });
  await db.execute({
    sql: `DELETE FROM chat_typing WHERE thread_id IN (${placeholders})`,
    args: ids,
  });
  await db.execute({
    sql: `DELETE FROM chat_threads WHERE id IN (${placeholders})`,
    args: ids,
  });

  return NextResponse.json({ ok: true, deleted: ids.length });
}
