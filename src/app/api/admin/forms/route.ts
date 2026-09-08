import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureDb, getDb } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 300`,
    args: [],
  });

  const forms = result.rows.map((r) => ({
    id: Number(r.id),
    form_type: String(r.form_type),
    name: (r.name as string) || null,
    email: (r.email as string) || null,
    phone: (r.phone as string) || null,
    payload: JSON.parse(String(r.payload || "{}")) as Record<string, unknown>,
    created_at: String(r.created_at),
  }));

  return NextResponse.json({ forms });
}
