"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const VisitorsMap = dynamic(() => import("./VisitorsMap"), { ssr: false });

type Visitor = {
  id: number;
  label: string;
  ip: string;
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
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const res = await fetch("/api/admin/visitors");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json()) as { visitors?: Visitor[]; error?: string };
      if (!alive) return;
      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }
      setVisitors(data.visitors || []);
    };
    void load();
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const active = useMemo(
    () => visitors.find((v) => v.id === selected) || visitors[0] || null,
    [visitors, selected],
  );

  return (
    <div className="admin-grid-2">
      <section className="admin-card admin-card-flush">
        <div className="admin-card-head">
          <h2>Visitor activity</h2>
          <span>{visitors.length} tracked</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
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
                  <td>
                    <strong>{v.label}</strong>
                    <em>{v.path || "/"}</em>
                  </td>
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
                  <td colSpan={4}>No visitors yet. Open the public site.</td>
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
