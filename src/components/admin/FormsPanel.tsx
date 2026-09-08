"use client";

import { useEffect, useState } from "react";

type FormItem = {
  id: number;
  form_type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function FormsPanel() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [selected, setSelected] = useState<FormItem | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const res = await fetch("/api/admin/forms");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json()) as { forms?: FormItem[] };
      if (alive) setForms(data.forms || []);
    };
    void load();
    const t = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="admin-grid-2">
      <section className="admin-card admin-card-flush">
        <div className="admin-card-head">
          <h2>Form submissions</h2>
          <span>{forms.length} entries</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr
                  key={f.id}
                  className={selected?.id === f.id ? "is-selected" : undefined}
                  onClick={() => setSelected(f)}
                >
                  <td>
                    <strong>{f.form_type}</strong>
                  </td>
                  <td>{f.name || "—"}</td>
                  <td>{f.email || "—"}</td>
                  <td>{fmt(f.created_at)}</td>
                </tr>
              ))}
              {!forms.length ? (
                <tr>
                  <td colSpan={4}>No form submissions yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Entry detail</h2>
        </div>
        {selected ? (
          <div className="admin-detail">
            <p>
              <strong>{selected.form_type}</strong> · {fmt(selected.created_at)}
            </p>
            <dl className="admin-meta">
              {Object.entries(selected.payload).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{String(v ?? "—")}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="admin-muted">Select a submission to inspect fields.</p>
        )}
      </section>
    </div>
  );
}
