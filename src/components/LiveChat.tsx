"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Msg = {
  id: number;
  sender: "visitor" | "admin";
  body: string;
  createdAt: string;
};

const THREAD_KEY = "exhibium_chat_thread";
const EMAIL_KEY = "exhibium_visitor_email";

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

function TypingDots({ label }: { label: string }) {
  return (
    <div className="lc-typing" aria-live="polite">
      <span className="lc-typing-avatar" aria-hidden="true">
        E
      </span>
      <div className="lc-typing-bubble">
        <span className="lc-dot" />
        <span className="lc-dot" />
        <span className="lc-dot" />
      </div>
      <em className="lc-typing-label">{label}</em>
    </div>
  );
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMsgCount = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
    const savedEmail = localStorage.getItem(EMAIL_KEY);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (!open || email) return;
    const creds = (
      navigator as Navigator & {
        credentials?: {
          get: (opts: object) => Promise<{ id?: string } | null>;
        };
      }
    ).credentials;
    if (!creds?.get) return;
    void creds
      .get({ password: true, mediation: "silent" } as object)
      .then((cred) => {
        const id = cred?.id?.trim();
        if (id && id.includes("@")) {
          setEmail(id);
          localStorage.setItem(EMAIL_KEY, id);
        }
      })
      .catch(() => undefined);
  }, [open, email]);

  useEffect(() => {
    if (!threadId) return;
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/chat?threadId=${threadId}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          messages?: Msg[];
          typing?: { admin?: boolean };
        };
        if (!alive) return;
        if (data.messages) {
          setMessages(data.messages);
          if (!open && data.messages.length > lastMsgCount.current) {
            const gained = data.messages.length - lastMsgCount.current;
            const last = data.messages[data.messages.length - 1];
            if (last?.sender === "admin") {
              setUnread((u) => u + Math.max(gained, 1));
            }
          }
          lastMsgCount.current = data.messages.length;
        }
        setPeerTyping(Boolean(data.typing?.admin));
      } catch {
        /* ignore */
      }
    };

    void load();
    const t = setInterval(load, 900);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [threadId, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, peerTyping, open]);

  const syncEmail = async (value: string) => {
    const cleaned = value.trim().toLowerCase();
    if (!cleaned) return;
    localStorage.setItem(EMAIL_KEY, cleaned);
    const vid = localStorage.getItem("exhibium_vid");
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        visitorId: vid ? Number(vid) : undefined,
        email: cleaned,
      }),
    }).catch(() => undefined);
  };

  const pulseTyping = (id: string) => {
    void fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "typing", threadId: id, typing: true }),
    }).catch(() => undefined);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      void fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "typing",
          threadId: id,
          typing: false,
        }),
      }).catch(() => undefined);
    }, 1800);
  };

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
      const data = (await res.json()) as {
        threadId?: string;
        messages?: Msg[];
      };
      if (!data.threadId) throw new Error("failed");
      localStorage.setItem(THREAD_KEY, data.threadId);
      setThreadId(data.threadId);
      if (data.messages) {
        setMessages(data.messages);
        lastMsgCount.current = data.messages.length;
      }
      return data.threadId;
    } finally {
      setStarting(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return;
    }
    setSending(true);
    setText("");
    const optimistic: Msg = {
      id: -Date.now(),
      sender: "visitor",
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await syncEmail(email);
      const id = await ensureThread();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", threadId: id, message: body }),
      });
      const data = (await res.json()) as {
        messages?: Msg[];
        typing?: { admin?: boolean };
      };
      if (data.messages) {
        setMessages(data.messages);
        lastMsgCount.current = data.messages.length;
      }
      setPeerTyping(Boolean(data.typing?.admin));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`lc-root${open ? " is-open" : ""}`}>
      {!open ? (
        <button
          type="button"
          className="lc-fab"
          aria-expanded={false}
          aria-label="Open live chat"
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
            />
          </svg>
          {unread > 0 ? (
            <span className="lc-fab-badge">{unread > 9 ? "9+" : unread}</span>
          ) : null}
        </button>
      ) : null}

      {open ? (
        <div className="lc-panel" role="dialog" aria-label="Exhibium live chat">
          <header className="lc-head">
            <div className="lc-head-user">
              <span className="lc-avatar" aria-hidden="true">
                E
              </span>
              <div>
                <p className="lc-head-title">Exhibium Advisory</p>
                <p className="lc-head-sub">
                  <span className="lc-pulse" /> Live · typically replies instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              className="lc-head-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="lc-body">
            {!messages.length ? (
              <div className="lc-welcome">
                <p className="lc-welcome-kicker">Conversation</p>
                <h3>How can we help?</h3>
                <p>
                  Ask about BIM/VDC, modular delivery, market entry, or book a
                  consult. Share your email below to start.
                </p>
              </div>
            ) : null}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`lc-row lc-row--${m.sender}`}
              >
                {m.sender === "admin" ? (
                  <span className="lc-mini-avatar" aria-hidden="true">
                    E
                  </span>
                ) : null}
                <div className="lc-msg">
                  <p>{m.body}</p>
                  <time>{fmtTime(m.createdAt)}</time>
                </div>
              </div>
            ))}

            {peerTyping ? <TypingDots label="Advisor is typing" /> : null}
            <div ref={bottomRef} />
          </div>

          <form className="lc-compose" onSubmit={onSubmit}>
            <label className="lc-email-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => void syncEmail(email)}
                placeholder="you@company.com"
                required
                disabled={starting || sending}
              />
            </label>
            <div className="lc-input-row">
              <textarea
                value={text}
                rows={1}
                onChange={(e) => {
                  setText(e.target.value);
                  if (threadId && e.target.value.trim()) {
                    pulseTyping(threadId);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Write a message…"
                maxLength={2000}
                disabled={starting || sending}
              />
              <button
                type="submit"
                className="lc-send"
                disabled={
                  starting || sending || !text.trim() || !email.trim()
                }
                aria-label="Send message"
              >
                {sending ? "…" : "→"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
