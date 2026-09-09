import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listForms } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rows = await listForms();
    const forms = rows.map((r) => ({
      id: r.id,
      form_type: r.form_type,
      name: r.name,
      email: r.email,
      phone: r.phone,
      payload: JSON.parse(r.payload || "{}") as Record<string, unknown>,
      created_at: r.created_at,
    }));
    return NextResponse.json({ forms });
  } catch (err) {
    console.error("forms get", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
