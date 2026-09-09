/**
 * Durable JSON document store (GitHub Gist) for serverless.
 * Falls back to in-memory when Gist is not configured (local/dev).
 */

export type StoreVisitor = {
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

export type StoreForm = {
  id: number;
  form_type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: string;
  created_at: string;
};

export type StoreThread = {
  id: string;
  visitor_label: string;
  visitor_ip: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type StoreMessage = {
  id: number;
  thread_id: string;
  sender: string;
  body: string;
  created_at: string;
};

export type AppStore = {
  visitorCounter: number;
  formCounter: number;
  messageCounter: number;
  visitors: StoreVisitor[];
  forms: StoreForm[];
  threads: StoreThread[];
  messages: StoreMessage[];
  typing: Record<string, { sender: string; updated_at: string }>;
};

const emptyStore = (): AppStore => ({
  visitorCounter: 0,
  formCounter: 0,
  messageCounter: 0,
  visitors: [],
  forms: [],
  threads: [],
  messages: [],
  typing: {},
});

type GistState = {
  store: AppStore;
  sha: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __exhibiumStoreCache: GistState | undefined;
  // eslint-disable-next-line no-var
  var __exhibiumStoreLock: Promise<void> | undefined;
}

function gistConfig() {
  const token = process.env.GITHUB_STORE_TOKEN?.trim();
  const gistId = process.env.GIST_ID?.trim();
  const file = process.env.GIST_FILE?.trim() || "store.json";
  if (!token || !gistId) return null;
  return { token, gistId, file };
}

async function readGist(): Promise<GistState> {
  const cfg = gistConfig();
  if (!cfg) {
    const mem = globalThis.__exhibiumStoreCache || {
      store: emptyStore(),
      sha: "memory",
    };
    globalThis.__exhibiumStoreCache = mem;
    return mem;
  }

  const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Gist read failed: ${res.status}`);
  }
  const data = (await res.json()) as {
    files?: Record<
      string,
      { content?: string; truncated?: boolean; raw_url?: string }
    >;
  };
  // GitHub gist update uses file content; concurrency via If-Match not available on gists easily.
  // We'll use the file's content and retry on write races.
  const fileEntry = data.files?.[cfg.file];
  let content = fileEntry?.content || "";
  if (fileEntry?.truncated && fileEntry.raw_url) {
    const raw = await fetch(`${fileEntry.raw_url}${fileEntry.raw_url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/vnd.github.raw",
      },
      cache: "no-store",
    });
    content = await raw.text();
  }
  let store: AppStore = emptyStore();
  try {
    store = { ...emptyStore(), ...(JSON.parse(content || "{}") as AppStore) };
  } catch {
    store = emptyStore();
  }
  // Use content hash as soft sha
  const sha = Buffer.from(content || "").toString("base64").slice(0, 32);
  const state = { store, sha };
  globalThis.__exhibiumStoreCache = state;
  return state;
}

async function writeGist(store: AppStore, _prevSha: string) {
  const cfg = gistConfig();
  if (!cfg) {
    globalThis.__exhibiumStoreCache = {
      store,
      sha: "memory",
    };
    return;
  }

  const content = JSON.stringify(store);
  const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      files: {
        [cfg.file]: { content },
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gist write failed: ${res.status} ${text.slice(0, 200)}`);
  }
  globalThis.__exhibiumStoreCache = {
    store,
    sha: Buffer.from(content).toString("base64").slice(0, 32),
  };
}

async function withStoreLock<T>(fn: (store: AppStore) => Promise<T> | T) {
  const prev = globalThis.__exhibiumStoreLock || Promise.resolve();
  let release!: () => void;
  globalThis.__exhibiumStoreLock = new Promise<void>((r) => {
    release = r;
  });
  await prev;
  try {
    let lastErr: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const { store, sha } = await readGist();
        const result = await fn(store);
        await writeGist(store, sha);
        return result;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 80 * (attempt + 1)));
      }
    }
    throw lastErr;
  } finally {
    release();
  }
}

export async function storeMutate<T>(fn: (store: AppStore) => Promise<T> | T) {
  return withStoreLock(fn);
}

export async function storeRead<T>(fn: (store: AppStore) => Promise<T> | T) {
  const { store } = await readGist();
  return fn(store);
}

export function isDurableStoreConfigured() {
  return Boolean(gistConfig());
}
