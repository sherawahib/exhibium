"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  chatbotNodes,
  chatbotStartId,
  type ChatOption,
} from "@/lib/chatbot";
import {
  contactEmail,
  whatsappHref,
} from "@/lib/site";

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
};

export function HelpChatbot() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState(chatbotStartId);
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: "welcome",
      role: "bot",
      text: chatbotNodes[chatbotStartId].prompt,
    },
  ]);
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const node = chatbotNodes[nodeId] ?? chatbotNodes[chatbotStartId];

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, showEmail, open]);

  const push = (role: Msg["role"], text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, role, text },
    ]);
  };

  const goTo = (nextId: string) => {
    const next = chatbotNodes[nextId];
    if (!next) return;
    setNodeId(nextId);
    setShowEmail(false);
    setEmailSent(false);
    push("bot", next.prompt);
  };

  const handleOption = (option: ChatOption) => {
    push("user", option.label);

    if (option.reply) {
      push("bot", option.reply);
    }

    if (option.action === "email") {
      setShowEmail(true);
      if (!option.reply) {
        push(
          "bot",
          `Didn’t find what you need? Send a short note to ${contactEmail} and the team will follow up.`,
        );
      }
      return;
    }

    if (option.action === "appointment") {
      push("bot", "Opening the appointment form…");
      window.location.href = "/appointment";
      return;
    }

    if (option.action === "whatsapp") {
      push("bot", "Opening WhatsApp…");
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
      return;
    }

    if (option.action === "link" && option.href) {
      push("bot", "Taking you there…");
      window.location.href = option.href;
      return;
    }

    if (option.next) {
      goTo(option.next);
    }
  };

  const resetChat = () => {
    setNodeId(chatbotStartId);
    setShowEmail(false);
    setEmailSent(false);
    setMessages([
      {
        id: "welcome-reset",
        role: "bot",
        text: chatbotNodes[chatbotStartId].prompt,
      },
    ]);
  };

  const onEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const topic = String(data.get("topic") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        push(
          "bot",
          payload.error ||
            `Could not send. Please email ${contactEmail} directly.`,
        );
        return;
      }
      setEmailSent(true);
      push(
        "bot",
        `Thanks — your message was sent to ${contactEmail}. We’ll follow up soon.`,
      );
    } catch {
      push(
        "bot",
        `Network error. Please email ${contactEmail} directly.`,
      );
    }
  };

  return (
    <div className={`help-chat${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="help-chat-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="help-chat-toggle-icon" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M18.3 5.71 12 12.01 5.7 5.7 4.29 7.11 10.59 13.4 4.29 19.7 5.7 21.11 12 14.82l6.3 6.29 1.41-1.41-6.29-6.3 6.29-6.29z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
              />
            </svg>
          )}
        </span>
        <span className="help-chat-toggle-label">
          {open ? "Close" : "Help"}
        </span>
      </button>

      <div
        id={panelId}
        className="help-chat-panel"
        role="dialog"
        aria-label="Exhibium help chatbot"
        hidden={!open}
      >
        <header className="help-chat-head">
          <div>
            <p className="help-chat-kicker">Exhibium guide</p>
            <h2 className="help-chat-title">Quick answers</h2>
          </div>
          <button
            type="button"
            className="help-chat-restart"
            onClick={resetChat}
          >
            Restart
          </button>
        </header>

        <div className="help-chat-log" ref={listRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`help-chat-bubble help-chat-bubble--${m.role}`}
            >
              {m.text}
            </div>
          ))}

          {showEmail && !emailSent && (
            <form className="help-chat-email" onSubmit={onEmailSubmit}>
              <p className="help-chat-email-lead">
                Drop your question — we’ll follow up at{" "}
                <strong>{contactEmail}</strong>.
              </p>
              <label>
                Name
                <input name="name" type="text" required autoComplete="name" />
              </label>
              <label>
                Your email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Topic
                <select name="topic" defaultValue="General">
                  <option>General</option>
                  <option>BIM / VDC</option>
                  <option>Modular</option>
                  <option>Market entry</option>
                  <option>Appointment</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="What should we help with?"
                />
              </label>
              <button type="submit" className="help-chat-email-submit">
                Send message
              </button>
            </form>
          )}
        </div>

        {!showEmail && (
          <div className="help-chat-options" role="group" aria-label="Choices">
            {node.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="help-chat-option"
                onClick={() => handleOption(opt)}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              className="help-chat-option help-chat-option--muted"
              onClick={() =>
                handleOption({
                  label: "Still need help — email us",
                  action: "email",
                })
              }
            >
              Still need help — email us
            </button>
          </div>
        )}

        {showEmail && emailSent && (
          <div className="help-chat-options">
            <button
              type="button"
              className="help-chat-option"
              onClick={resetChat}
            >
              Back to questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
