import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStats } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await getStats());
  } catch (err) {
    console.error("stats get", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
