"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        return;
      }
      router.replace("/admin/visitors");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <p className="admin-login-kicker">Exhibium</p>
        <h1>Admin sign in</h1>
        <p>Visitors, form leads, and live chat console.</p>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}
