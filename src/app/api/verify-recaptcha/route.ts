import { NextResponse } from "next/server";

type GoogleVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json(
      { success: false, error: "reCAPTCHA secret is not configured." },
      { status: 503 },
    );
  }

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

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing reCAPTCHA token." },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  const googleRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    },
  );

  const result = (await googleRes.json()) as GoogleVerifyResponse;

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: "reCAPTCHA verification failed.",
        codes: result["error-codes"] ?? [],
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
