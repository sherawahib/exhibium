"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Thread = {
  id: string;
  visitorLabel: string;
  visitorIp: string | null;
  status: string;
  updatedAt: string;
  lastMessage: string | null;
};

type Msg = {
  id: number;
  sender: string;
  body: string;
  createdAt: string;
};

export function ChatPanel() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const res = await fetch("/api/admin/chat");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json()) as { threads?: Thread[] };
      if (alive) setThreads(data.threads || []);
    };
    void load();
    const t = setInterval(load, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    const load = async () => {
      const res = await fetch(`/api/admin/chat?threadId=${activeId}`);
      const data = (await res.json()) as { messages?: Msg[] };
      if (alive) setMessages(data.messages || []);
    };
    void load();
    const t = setInterval(load, 2000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeId || !text.trim()) return;
    const body = text.trim();
    setText("");
    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: activeId, message: body }),
    });
    const res = await fetch(`/api/admin/chat?threadId=${activeId}`);
    const data = (await res.json()) as { messages?: Msg[] };
    setMessages(data.messages || []);
  };

  return (
    <div className="admin-chat">
      <aside className="admin-chat-list admin-card admin-card-flush">
        <div className="admin-card-head">
          <h2>Conversations</h2>
          <span>{threads.length}</span>
        </div>
        <ul>
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={activeId === t.id ? "is-active" : undefined}
                onClick={() => setActiveId(t.id)}
              >
                <strong>{t.visitorLabel}</strong>
                <em>{t.lastMessage || "No messages"}</em>
                <span>{t.status}</span>
              </button>
            </li>
          ))}
          {!threads.length ? <li className="admin-muted">No chats yet.</li> : null}
        </ul>
      </aside>

      <section className="admin-card admin-chat-room">
        {activeId ? (
          <>
            <div className="admin-card-head">
              <h2>Thread</h2>
              <span>{activeId.slice(0, 8)}…</span>
            </div>
            <div className="admin-chat-log">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`admin-chat-bubble admin-chat-bubble--${m.sender}`}
                >
                  {m.body}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form className="admin-chat-compose" onSubmit={send}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Reply as Exhibium…"
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p className="admin-muted">Select a conversation to reply live.</p>
        )}
      </section>
    </div>
  );
}
