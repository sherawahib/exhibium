import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteVisitors, listVisitors } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const visitors = await listVisitors();
    return NextResponse.json({ visitors });
  } catch (err) {
    console.error("visitors get", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { ids?: number[] };
  const ids = (body.ids || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
  if (!ids.length) {
    return NextResponse.json({ error: "No visitors selected" }, { status: 400 });
  }
  try {
    const deleted = await deleteVisitors(ids);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error("visitors delete", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
