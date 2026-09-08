"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

type Stats = {
  visitors: number;
  forms: number;
  chats: number;
  openChats: number;
};

export function AdminOverviewClient() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    void fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data as Stats))
      .catch(() => undefined);
  }, []);

  return (
    <AdminShell title="Overview">
      <div className="admin-stats">
        <Link href="/admin/visitors" className="admin-stat">
          <em>Visitors</em>
          <strong>{stats?.visitors ?? "—"}</strong>
        </Link>
        <Link href="/admin/forms" className="admin-stat">
          <em>Forms</em>
          <strong>{stats?.forms ?? "—"}</strong>
        </Link>
        <Link href="/admin/chat" className="admin-stat">
          <em>Chat threads</em>
          <strong>{stats?.chats ?? "—"}</strong>
        </Link>
        <Link href="/admin/chat" className="admin-stat">
          <em>Open chats</em>
          <strong>{stats?.openChats ?? "—"}</strong>
        </Link>
      </div>
      <p className="admin-muted">
        Track site visitors with IP/geo/map, review appointment & chatbot form
        leads, and reply to live chat in real time.
      </p>
    </AdminShell>
  );
}
