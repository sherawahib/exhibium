import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function dbUrl() {
  if (process.env.TURSO_DATABASE_URL?.trim()) {
    return process.env.TURSO_DATABASE_URL.trim();
  }
  // Local / tmp persistence
  const dir =
    process.env.VERCEL === "1"
      ? "/tmp"
      : path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = path.join(dir, "admin.db");
  // libsql expects file: URL
  return `file:${file.replace(/\\/g, "/")}`;
}

export function getDb() {
  if (!client) {
    client = createClient({
      url: dbUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
    });
  }
  return client;
}

export async function ensureDb() {
  if (!ready) {
    ready = (async () => {
      const db = getDb();
      await db.executeMultiple(`
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS visitors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT NOT NULL,
          ip TEXT NOT NULL,
          email TEXT,
          country TEXT,
          region TEXT,
          city TEXT,
          latitude REAL,
          longitude REAL,
          user_agent TEXT,
          path TEXT,
          created_at TEXT NOT NULL,
          last_seen_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS form_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          form_type TEXT NOT NULL,
          name TEXT,
          email TEXT,
          phone TEXT,
          payload TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS chat_threads (
          id TEXT PRIMARY KEY,
          visitor_label TEXT NOT NULL,
          visitor_ip TEXT,
          status TEXT NOT NULL DEFAULT 'open',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          thread_id TEXT NOT NULL,
          sender TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (thread_id) REFERENCES chat_threads(id)
        );
        CREATE INDEX IF NOT EXISTS idx_visitors_last ON visitors(last_seen_at);
        CREATE INDEX IF NOT EXISTS idx_forms_created ON form_submissions(created_at);
        CREATE INDEX IF NOT EXISTS idx_messages_thread ON chat_messages(thread_id, created_at);
      `);
      // Migrations for existing DBs
      try {
        await db.execute(`ALTER TABLE visitors ADD COLUMN email TEXT`);
      } catch {
        /* column already exists */
      }
    })();
  }
  await ready;
}

export async function nextVisitorNumber() {
  await ensureDb();
  const db = getDb();
  const row = await db.execute({
    sql: `SELECT value FROM meta WHERE key = 'visitor_counter'`,
    args: [],
  });
  const current = Number(row.rows[0]?.value || 0);
  const next = current + 1;
  await db.execute({
    sql: `INSERT INTO meta (key, value) VALUES ('visitor_counter', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [String(next)],
  });
  return next;
}

export type VisitorRow = {
  id: number;
  label: string;
  ip: string;
  email: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  user_agent: string | null;
  path: string | null;
  created_at: string;
  last_seen_at: string;
};

export type FormRow = {
  id: number;
  form_type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: string;
  created_at: string;
};

export type ChatThread = {
  id: string;
  visitor_label: string;
  visitor_ip: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: number;
  thread_id: string;
  sender: string;
  body: string;
  created_at: string;
};
