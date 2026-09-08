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

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatPanel() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadThreads = async () => {
    const res = await fetch("/api/admin/chat", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await res.json()) as { threads?: Thread[] };
    const list = data.threads || [];
    setThreads(list);
    setChecked((prev) => prev.filter((id) => list.some((t) => t.id === id)));
  };

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      await loadThreads();
    };
    void tick();
    const t = setInterval(tick, 2000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    const load = async () => {
      const res = await fetch(`/api/admin/chat?threadId=${activeId}`, {
        cache: "no-store",
      });
      if (res.status === 404) {
        if (alive) {
          setActiveId(null);
          setMessages([]);
        }
        return;
      }
      const data = (await res.json()) as {
        messages?: Msg[];
        typing?: { visitor?: boolean };
      };
      if (!alive) return;
      if (data.messages) setMessages(data.messages);
      setVisitorTyping(Boolean(data.typing?.visitor));
    };
    void load();
    const t = setInterval(load, 800);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, visitorTyping]);

  const pulseTyping = () => {
    if (!activeId) return;
    void fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "typing",
        threadId: activeId,
        typing: true,
      }),
    }).catch(() => undefined);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      void fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "typing",
          threadId: activeId,
          typing: false,
        }),
      }).catch(() => undefined);
    }, 1800);
  };

  const deleteChats = async (ids: string[]) => {
    if (!ids.length) return;
    if (
      !window.confirm(
        `Delete ${ids.length} chat${ids.length > 1 ? "s" : ""} permanently?`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) return;
      if (activeId && ids.includes(activeId)) {
        setActiveId(null);
        setMessages([]);
      }
      setChecked((prev) => prev.filter((id) => !ids.includes(id)));
      await loadThreads();
    } finally {
      setDeleting(false);
    }
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeId || !text.trim()) return;
    const body = text.trim();
    setText("");
    setSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: -Date.now(),
        sender: "admin",
        body,
        createdAt: new Date().toISOString(),
      },
    ]);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: activeId, message: body }),
      });
      const data = (await res.json()) as {
        messages?: Msg[];
        typing?: { visitor?: boolean };
      };
      if (data.messages) setMessages(data.messages);
      setVisitorTyping(Boolean(data.typing?.visitor));
    } finally {
      setSending(false);
    }
  };

  const active = threads.find((t) => t.id === activeId) || null;
  const allChecked =
    threads.length > 0 && checked.length === threads.length;

  return (
    <div className="admin-chat admin-chat-pro">
      <aside className="admin-chat-list admin-card admin-card-flush">
        <div className="admin-card-head">
          <h2>Inbox</h2>
          <div className="admin-card-actions">
            <span>{threads.length} chats</span>
            <button
              type="button"
              className="admin-danger-btn"
              disabled={!checked.length || deleting}
              onClick={() => void deleteChats(checked)}
            >
              {deleting
                ? "Deleting…"
                : `Delete${checked.length ? ` (${checked.length})` : ""}`}
            </button>
          </div>
        </div>
        <div className="admin-chat-select-all">
          <label>
            <input
              type="checkbox"
              checked={allChecked}
              onChange={() =>
                setChecked(allChecked ? [] : threads.map((t) => t.id))
              }
            />
            Select all
          </label>
        </div>
        <ul>
          {threads.map((t) => (
            <li key={t.id}>
              <div className="admin-chat-row">
                <input
                  type="checkbox"
                  checked={checked.includes(t.id)}
                  onChange={() =>
                    setChecked((prev) =>
                      prev.includes(t.id)
                        ? prev.filter((id) => id !== t.id)
                        : [...prev, t.id],
                    )
                  }
                  aria-label={`Select ${t.visitorLabel}`}
                />
                <button
                  type="button"
                  className={activeId === t.id ? "is-active" : undefined}
                  onClick={() => setActiveId(t.id)}
                >
                  <span className="admin-chat-avatar" aria-hidden="true">
                    {t.visitorLabel.replace(/\D/g, "").slice(-2) || "V"}
                  </span>
                  <span className="admin-chat-meta">
                    <strong>{t.visitorLabel}</strong>
                    <em>{t.lastMessage || "No messages yet"}</em>
                  </span>
                  <span className={`admin-chat-pill is-${t.status}`}>
                    {t.status}
                  </span>
                </button>
                <button
                  type="button"
                  className="admin-chat-delete-one"
                  title="Delete chat"
                  disabled={deleting}
                  onClick={() => void deleteChats([t.id])}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!threads.length ? (
            <li className="admin-muted admin-chat-empty">
              Waiting for visitors to start a chat…
            </li>
          ) : null}
        </ul>
      </aside>

      <section className="admin-card admin-chat-room admin-chat-room-pro">
        {activeId && active ? (
          <>
            <div className="admin-chat-room-head">
              <div>
                <h2>{active.visitorLabel}</h2>
                <p>
                  {active.visitorIp || "IP unknown"} ·{" "}
                  {new Date(active.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="admin-chat-room-actions">
                <span className="admin-chat-live">Live</span>
                <button
                  type="button"
                  className="admin-danger-btn"
                  disabled={deleting}
                  onClick={() => void deleteChats([activeId])}
                >
                  Delete chat
                </button>
              </div>
            </div>
            <div className="admin-chat-log admin-chat-log-pro">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`admin-chat-bubble admin-chat-bubble--${m.sender}`}
                >
                  <p>{m.body}</p>
                  <time>{fmtTime(m.createdAt)}</time>
                </div>
              ))}
              {visitorTyping ? (
                <div className="admin-typing">
                  <span className="lc-dot" />
                  <span className="lc-dot" />
                  <span className="lc-dot" />
                  <em>Visitor is typing</em>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
            <form
              className="admin-chat-compose admin-chat-compose-pro"
              onSubmit={send}
            >
              <textarea
                value={text}
                rows={2}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value.trim()) pulseTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Reply as Exhibium…"
              />
              <button type="submit" disabled={sending || !text.trim()}>
                {sending ? "Sending…" : "Send"}
              </button>
            </form>
          </>
        ) : (
          <div className="admin-chat-placeholder">
            <h3>Select a conversation</h3>
            <p>Reply live to visitors from the public site chat widget.</p>
          </div>
        )}
      </section>
    </div>
  );
}
