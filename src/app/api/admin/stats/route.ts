import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureDb, getDb } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDb();
  const db = getDb();

  const [visitors, forms, chats, openChats] = await Promise.all([
    db.execute(`SELECT COUNT(*) AS c FROM visitors`),
    db.execute(`SELECT COUNT(*) AS c FROM form_submissions`),
    db.execute(`SELECT COUNT(*) AS c FROM chat_threads`),
    db.execute(`SELECT COUNT(*) AS c FROM chat_threads WHERE status = 'open'`),
  ]);

  return NextResponse.json({
    visitors: Number(visitors.rows[0]?.c || 0),
    forms: Number(forms.rows[0]?.c || 0),
    chats: Number(chats.rows[0]?.c || 0),
    openChats: Number(openChats.rows[0]?.c || 0),
  });
}
