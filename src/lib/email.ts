import { contactEmail } from "@/lib/site";

export type OutboundEmail = {
  subject: string;
  text: string;
  replyTo?: string;
  /** Optional HTML body */
  html?: string;
};

export async function sendSiteEmail(
  mail: OutboundEmail,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "Email service is not configured (RESEND_API_KEY).",
    };
  }

  const to = process.env.EMAIL_TO?.trim() || contactEmail;
  const from =
    process.env.EMAIL_FROM?.trim() ||
    "Exhibium Website <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      reply_to: mail.replyTo || undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend error:", res.status, detail);
    return {
      ok: false,
      error: "Failed to send email. Please try again or email us directly.",
    };
  }

  return { ok: true };
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
