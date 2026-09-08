import { ensureDb, getDb } from "@/lib/db";

export async function saveFormSubmission(input: {
  formType: string;
  name?: string;
  email?: string;
  phone?: string;
  payload: Record<string, unknown>;
}) {
  await ensureDb();
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO form_submissions (form_type, name, email, phone, payload, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      input.formType,
      input.name || null,
      input.email || null,
      input.phone || null,
      JSON.stringify(input.payload),
      new Date().toISOString(),
    ],
  });
}
