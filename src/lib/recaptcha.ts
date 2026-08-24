type GoogleVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyRecaptchaServer(
  token: string,
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, error: "reCAPTCHA secret is not configured." };
  }

  const value = token.trim();
  if (!value) {
    return { ok: false, error: "Missing reCAPTCHA token." };
  }

  const params = new URLSearchParams({
    secret,
    response: value,
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
    return { ok: false, error: "reCAPTCHA verification failed." };
  }

  return { ok: true };
}
