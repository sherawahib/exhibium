"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const VisitorsMap = dynamic(() => import("./VisitorsMap"), { ssr: false });

type Visitor = {
  id: number;
  label: string;
  ip: string;
  email: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  path: string | null;
  created_at: string;
  last_seen_at: string;
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function VisitorsPanel() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/visitors");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await res.json()) as { visitors?: Visitor[]; error?: string };
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return;
    }
    setVisitors(data.visitors || []);
    setChecked((prev) =>
      prev.filter((id) => (data.visitors || []).some((v) => v.id === id)),
    );
  };

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      await load();
    };
    void tick();
    const t = setInterval(tick, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const active = useMemo(
    () => visitors.find((v) => v.id === selected) || visitors[0] || null,
    [visitors, selected],
  );

  const allChecked =
    visitors.length > 0 && checked.length === visitors.length;

  const toggleAll = () => {
    setChecked(allChecked ? [] : visitors.map((v) => v.id));
  };

  const toggleOne = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const deleteSelected = async () => {
    if (!checked.length) return;
    if (
      !window.confirm(
        `Delete ${checked.length} selected visitor location(s)? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/visitors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: checked }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Delete failed");
        return;
      }
      setChecked([]);
      if (selected && checked.includes(selected)) setSelected(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-grid-2">
      <section className="admin-card admin-card-flush">
        <div className="admin-card-head">
          <h2>Visitor activity</h2>
          <div className="admin-card-actions">
            <span>{visitors.length} tracked</span>
            <button
              type="button"
              className="admin-danger-btn"
              disabled={!checked.length || deleting}
              onClick={deleteSelected}
            >
              {deleting
                ? "Deleting…"
                : `Delete selected${checked.length ? ` (${checked.length})` : ""}`}
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-check-col">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Select all visitors"
                  />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>IP</th>
                <th>Location</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr
                  key={v.id}
                  className={active?.id === v.id ? "is-selected" : undefined}
                  onClick={() => setSelected(v.id)}
                >
                  <td
                    className="admin-check-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(v.id)}
                      onChange={() => toggleOne(v.id)}
                      aria-label={`Select ${v.label}`}
                    />
                  </td>
                  <td>
                    <strong>{v.label}</strong>
                    <em>{v.path || "/"}</em>
                  </td>
                  <td>{v.email || "—"}</td>
                  <td>
                    <code>{v.ip}</code>
                  </td>
                  <td>
                    {[v.city, v.region, v.country].filter(Boolean).join(", ") ||
                      "—"}
                  </td>
                  <td>{fmt(v.last_seen_at)}</td>
                </tr>
              ))}
              {!visitors.length ? (
                <tr>
                  <td colSpan={6}>No visitors yet. Open the public site.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Location map</h2>
          <span>{active?.label || "—"}</span>
        </div>
        <VisitorsMap
          visitors={visitors}
          focusId={active?.id ?? null}
          onSelect={setSelected}
        />
        {active ? (
          <dl className="admin-meta">
            <div>
              <dt>Email</dt>
              <dd>{active.email || "Not provided yet"}</dd>
            </div>
            <div>
              <dt>Date / time first seen</dt>
              <dd>{fmt(active.created_at)}</dd>
            </div>
            <div>
              <dt>Last activity</dt>
              <dd>{fmt(active.last_seen_at)}</dd>
            </div>
            <div>
              <dt>City / State / Country</dt>
              <dd>
                {[active.city, active.region, active.country]
                  .filter(Boolean)
                  .join(" · ") || "Unavailable"}
              </dd>
            </div>
            <div>
              <dt>Coordinates</dt>
              <dd>
                {active.latitude != null && active.longitude != null
                  ? `${active.latitude.toFixed(4)}, ${active.longitude.toFixed(4)}`
                  : "—"}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>
    </div>
  );
}
