"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Msg = {
  id: number;
  sender: "visitor" | "admin";
  body: string;
  createdAt: string;
};

const THREAD_KEY = "exhibium_chat_thread";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    if (!open || !threadId) return;
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/chat?threadId=${threadId}`);
        const data = (await res.json()) as { messages?: Msg[] };
        if (alive && data.messages) setMessages(data.messages);
      } catch {
        /* ignore */
      }
    };

    void load();
    const t = setInterval(load, 2500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [open, threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const ensureThread = async () => {
    if (threadId) return threadId;
    setStarting(true);
    try {
      const vid = localStorage.getItem("exhibium_vid");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          visitorLabel: vid ? `User ${vid}` : "Visitor",
        }),
      });
      const data = (await res.json()) as { threadId?: string };
      if (!data.threadId) throw new Error("failed");
      localStorage.setItem(THREAD_KEY, data.threadId);
      setThreadId(data.threadId);
      return data.threadId;
    } finally {
      setStarting(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    setText("");
    try {
      const id = await ensureThread();
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", threadId: id, message: body }),
      });
      const res = await fetch(`/api/chat?threadId=${id}`);
      const data = (await res.json()) as { messages?: Msg[] };
      if (data.messages) setMessages(data.messages);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`live-chat${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="live-chat-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? "×" : "💬"}</span>
        <span className="live-chat-toggle-label">
          {open ? "Close" : "Live chat"}
        </span>
      </button>

      {open ? (
        <div className="live-chat-panel" role="dialog" aria-label="Live chat">
          <header className="live-chat-head">
            <div>
              <p className="live-chat-kicker">Exhibium Support</p>
              <h2>Live chat</h2>
            </div>
            <span className="live-chat-online">Online</span>
          </header>

          <div className="live-chat-log">
            {!threadId && messages.length === 0 ? (
              <p className="live-chat-hint">
                Ask about BIM, modular, market entry, or appointments. An
                advisor will reply here.
              </p>
            ) : null}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`live-chat-bubble live-chat-bubble--${m.sender}`}
              >
                {m.body}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="live-chat-compose" onSubmit={onSubmit}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message…"
              maxLength={2000}
              disabled={starting || sending}
            />
            <button type="submit" disabled={starting || sending || !text.trim()}>
              Send
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
