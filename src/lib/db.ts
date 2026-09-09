import { randomUUID } from "crypto";
import {
  storeMutate,
  storeRead,
  type StoreForm,
  type StoreMessage,
  type StoreThread,
  type StoreVisitor,
} from "@/lib/store";

export type VisitorRow = StoreVisitor;
export type FormRow = StoreForm;
export type ChatThread = StoreThread;
export type ChatMessage = StoreMessage;

export async function ensureDb() {
  // no-op: document store initializes on first read
}

export async function nextVisitorNumber() {
  return storeMutate((store) => {
    store.visitorCounter += 1;
    return store.visitorCounter;
  });
}

export async function listVisitors() {
  return storeRead((store) =>
    [...store.visitors].sort((a, b) =>
      b.last_seen_at.localeCompare(a.last_seen_at),
    ),
  );
}

export async function deleteVisitors(ids: number[]) {
  return storeMutate((store) => {
    const set = new Set(ids);
    store.visitors = store.visitors.filter((v) => !set.has(v.id));
    return ids.length;
  });
}

export async function upsertVisitor(input: {
  visitorId?: number;
  ip: string;
  path: string;
  userAgent: string;
  email?: string | null;
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}) {
  return storeMutate((store) => {
    const now = new Date().toISOString();
    if (input.visitorId) {
      const existing = store.visitors.find((v) => v.id === input.visitorId);
      if (existing) {
        existing.last_seen_at = now;
        existing.path = input.path;
        existing.user_agent = input.userAgent;
        if (input.email) existing.email = input.email;
        return { id: existing.id, label: existing.label, email: existing.email };
      }
    }

    const recentCutoff = Date.now() - 12 * 60 * 60 * 1000;
    const recent = store.visitors
      .filter(
        (v) =>
          v.ip === input.ip &&
          new Date(v.last_seen_at).getTime() > recentCutoff,
      )
      .sort((a, b) => b.last_seen_at.localeCompare(a.last_seen_at))[0];

    if (recent) {
      recent.last_seen_at = now;
      recent.path = input.path;
      recent.user_agent = input.userAgent;
      if (input.email) recent.email = input.email;
      return { id: recent.id, label: recent.label, email: recent.email };
    }

    store.visitorCounter += 1;
    const id = store.visitorCounter;
    const label = `User ${id}`;
    store.visitors.unshift({
      id,
      label,
      ip: input.ip,
      email: input.email || null,
      country: input.geo.country,
      region: input.geo.region,
      city: input.geo.city,
      latitude: input.geo.latitude,
      longitude: input.geo.longitude,
      user_agent: input.userAgent,
      path: input.path,
      created_at: now,
      last_seen_at: now,
    });
    return { id, label, email: input.email || null };
  });
}

export async function saveForm(input: {
  formType: string;
  name?: string;
  email?: string;
  phone?: string;
  visitorId?: number;
  payload: Record<string, unknown>;
}) {
  return storeMutate((store) => {
    store.formCounter += 1;
    store.forms.unshift({
      id: store.formCounter,
      form_type: input.formType,
      name: input.name || null,
      email: input.email || null,
      phone: input.phone || null,
      payload: JSON.stringify(input.payload),
      created_at: new Date().toISOString(),
    });
    const email = String(input.email || "")
      .trim()
      .toLowerCase();
    if (email && input.visitorId) {
      const v = store.visitors.find((x) => x.id === input.visitorId);
      if (v) {
        v.email = email;
        v.last_seen_at = new Date().toISOString();
      }
    }
  });
}

export async function listForms() {
  return storeRead((store) =>
    [...store.forms].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  );
}

export async function startChatThread(input: {
  visitorLabel: string;
  ip: string;
  firstMessage?: string;
}) {
  return storeMutate((store) => {
    const now = new Date().toISOString();
    const id = randomUUID();
    store.threads.unshift({
      id,
      visitor_label: input.visitorLabel,
      visitor_ip: input.ip,
      status: "open",
      created_at: now,
      updated_at: now,
    });
    store.messageCounter += 1;
    store.messages.push({
      id: store.messageCounter,
      thread_id: id,
      sender: "admin",
      body: "Hi — welcome to Exhibium. How can we help with BIM, modular, or market entry today?",
      created_at: now,
    });
    if (input.firstMessage?.trim()) {
      store.messageCounter += 1;
      store.messages.push({
        id: store.messageCounter,
        thread_id: id,
        sender: "visitor",
        body: input.firstMessage.trim().slice(0, 2000),
        created_at: new Date().toISOString(),
      });
      store.threads[0].updated_at = new Date().toISOString();
    }
    return {
      threadId: id,
      messages: store.messages.filter((m) => m.thread_id === id),
    };
  });
}

export async function addChatMessage(input: {
  threadId: string;
  sender: "visitor" | "admin";
  body: string;
}) {
  return storeMutate((store) => {
    const thread = store.threads.find((t) => t.id === input.threadId);
    if (!thread) return null;
    const now = new Date().toISOString();
    store.messageCounter += 1;
    const msg: StoreMessage = {
      id: store.messageCounter,
      thread_id: input.threadId,
      sender: input.sender,
      body: input.body.trim().slice(0, 2000),
      created_at: now,
    };
    store.messages.push(msg);
    thread.updated_at = now;
    thread.status = "open";
    const typingKey = `${input.threadId}:${input.sender}`;
    delete store.typing[typingKey];
    return {
      message: msg,
      messages: store.messages.filter((m) => m.thread_id === input.threadId),
    };
  });
}

export async function getChatMessages(threadId: string) {
  return storeRead((store) =>
    store.messages
      .filter((m) => m.thread_id === threadId)
      .sort((a, b) => a.id - b.id),
  );
}

export async function setTyping(
  threadId: string,
  sender: "visitor" | "admin",
  typing: boolean,
) {
  return storeMutate((store) => {
    const key = `${threadId}:${sender}`;
    if (typing) {
      store.typing[key] = {
        sender,
        updated_at: new Date().toISOString(),
      };
    } else {
      delete store.typing[key];
    }
  });
}

export async function getTypingFlags(threadId: string) {
  return storeRead((store) => {
    const cutoff = Date.now() - 3000;
    let visitor = false;
    let admin = false;
    for (const [key, value] of Object.entries(store.typing)) {
      if (!key.startsWith(`${threadId}:`)) continue;
      if (new Date(value.updated_at).getTime() < cutoff) continue;
      if (value.sender === "visitor") visitor = true;
      if (value.sender === "admin") admin = true;
    }
    return { visitor, admin };
  });
}

export async function listThreads() {
  return storeRead((store) => {
    return [...store.threads]
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map((t) => {
        const last = [...store.messages]
          .filter((m) => m.thread_id === t.id)
          .sort((a, b) => b.id - a.id)[0];
        return {
          id: t.id,
          visitorLabel: t.visitor_label,
          visitorIp: t.visitor_ip,
          status: t.status,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          lastMessage: last?.body || null,
        };
      });
  });
}

export async function deleteThreads(ids: string[]) {
  return storeMutate((store) => {
    const set = new Set(ids);
    store.threads = store.threads.filter((t) => !set.has(t.id));
    store.messages = store.messages.filter((m) => !set.has(m.thread_id));
    for (const key of Object.keys(store.typing)) {
      const threadId = key.split(":")[0];
      if (set.has(threadId)) delete store.typing[key];
    }
    return ids.length;
  });
}

export async function getStats() {
  return storeRead((store) => ({
    visitors: store.visitors.length,
    forms: store.forms.length,
    chats: store.threads.length,
    openChats: store.threads.filter((t) => t.status === "open").length,
  }));
}
