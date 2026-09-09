import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  addChatMessage,
  deleteThreads,
  getChatMessages,
  getTypingFlags,
  listThreads,
  setTyping,
} from "@/lib/db";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (threadId) {
      const messages = await getChatMessages(threadId);
      return NextResponse.json({
        messages: messages.map((m) => ({
          id: m.id,
          threadId: m.thread_id,
          sender: m.sender,
          body: m.body,
          createdAt: m.created_at,
        })),
        typing: await getTypingFlags(threadId),
      });
    }

    return NextResponse.json({ threads: await listThreads() });
  } catch (err) {
    console.error("admin chat get", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      threadId?: string;
      message?: string;
      status?: string;
      action?: string;
      typing?: boolean;
    };

    const threadId = String(body.threadId || "");

    if (body.action === "typing" && threadId) {
      await setTyping(threadId, "admin", Boolean(body.typing));
      return NextResponse.json({ ok: true });
    }

    const message = String(body.message || "").trim();
    if (!threadId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const saved = await addChatMessage({
      threadId,
      sender: "admin",
      body: message,
    });
    if (!saved) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: {
        id: saved.message.id,
        threadId: saved.message.thread_id,
        sender: saved.message.sender,
        body: saved.message.body,
        createdAt: saved.message.created_at,
      },
      messages: saved.messages.map((m) => ({
        id: m.id,
        threadId: m.thread_id,
        sender: m.sender,
        body: m.body,
        createdAt: m.created_at,
      })),
      typing: await getTypingFlags(threadId),
    });
  } catch (err) {
    console.error("admin chat post", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
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

  try {
    const deleted = await deleteThreads(ids);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error("admin chat delete", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
