import { NextResponse } from "next/server";
import { verifyRecaptchaServer } from "@/lib/recaptcha";

export async function POST(request: Request) {
  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = String(body.token || "").trim();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = await verifyRecaptchaServer(token);
  if (!result.ok) {
    const status = result.error?.includes("not configured") ? 503 : 400;
    return NextResponse.json(
      { success: false, error: result.error },
      { status },
    );
  }

  return NextResponse.json({ success: true });
}
