import { NextResponse } from "next/server";
import {
  addChatMessage,
  getChatMessages,
  getTypingFlags,
  setTyping,
  startChatThread,
} from "@/lib/db";
import { clientIp } from "@/lib/geo";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      threadId?: string;
      message?: string;
      visitorLabel?: string;
      typing?: boolean;
    };

    const action = body.action || "send";
    const ip = clientIp(request);

    if (action === "start") {
      const label = String(body.visitorLabel || "Visitor").slice(0, 40);
      const firstMessage = String(body.message || "").trim();
      const started = await startChatThread({
        visitorLabel: label,
        ip,
        firstMessage: firstMessage || undefined,
      });
      return NextResponse.json({
        threadId: started.threadId,
        messages: started.messages.map((m) => ({
          id: m.id,
          threadId: m.thread_id,
          sender: m.sender,
          body: m.body,
          createdAt: m.created_at,
        })),
        typing: await getTypingFlags(started.threadId),
      });
    }

    if (action === "typing") {
      const threadId = String(body.threadId || "");
      if (!threadId) {
        return NextResponse.json({ error: "Missing thread" }, { status: 400 });
      }
      await setTyping(threadId, "visitor", Boolean(body.typing));
      return NextResponse.json({ ok: true });
    }

    if (action === "send") {
      const threadId = String(body.threadId || "");
      const message = String(body.message || "").trim();
      if (!threadId || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      const saved = await addChatMessage({
        threadId,
        sender: "visitor",
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
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("chat error", err);
    return NextResponse.json({ error: "chat failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");
    if (!threadId) {
      return NextResponse.json({ error: "threadId required" }, { status: 400 });
    }
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
  } catch (err) {
    console.error("chat get error", err);
    return NextResponse.json({ error: "chat failed" }, { status: 500 });
  }
}
