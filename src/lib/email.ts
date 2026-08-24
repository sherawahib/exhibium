import { contactEmail, contactPhone } from "@/lib/site";

export type OutboundEmail = {
  /** Client / reply address (also receives thank-you autoresponse when set) */
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  /** Extra fields shown in the notification email */
  fields?: Record<string, string>;
  /** Thank-you body emailed to the client */
  autoresponse?: string;
};

export function getInboxTo() {
  return process.env.EMAIL_TO?.trim() || contactEmail;
}

/**
 * Sends via FormSubmit (no Resend / domain setup).
 * First submission: confirm the activation email at EMAIL_TO / contactEmail.
 */
export async function sendSiteEmail(
  mail: OutboundEmail,
): Promise<{ ok: boolean; error?: string }> {
  const inbox = getInboxTo();
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`;

  const payload: Record<string, string> = {
    _subject: mail.subject,
    _template: "box",
    _captcha: "false",
    message: mail.text,
    ...(mail.fields || {}),
  };

  if (mail.replyTo) {
    payload.email = mail.replyTo;
    payload._replyto = mail.replyTo;
  }

  if (mail.autoresponse) {
    payload._autoresponse = mail.autoresponse;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  let parsed: { success?: string | boolean; message?: string } = {};
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    /* non-JSON error page */
  }

  const ok =
    res.ok &&
    (parsed.success === true ||
      parsed.success === "true" ||
      /success|thank/i.test(raw));

  if (!ok) {
    console.error("FormSubmit error:", res.status, raw.slice(0, 500));
    return {
      ok: false,
      error:
        "Could not send email. If this is the first submit, check the inbox for a FormSubmit activation link, then try again.",
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

export function appointmentThankYouText(input: {
  name: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  format: string;
}) {
  const first = input.name.split(/\s+/)[0] || input.name;
  return [
    `Hi ${first},`,
    "",
    "Thank you for contacting Exhibium Group. We received your appointment request and will confirm availability by reply.",
    "",
    "Summary:",
    `- Focus: ${input.type}`,
    `- Preferred date: ${input.date}`,
    `- Preferred time: ${input.time}`,
    `- Duration: ${input.duration}`,
    `- Format: ${input.format}`,
    "",
    `Reply to this email or write ${contactEmail} · ${contactPhone}`,
    "",
    "— Exhibium Group",
    `(${contactEmail})`,
  ].join("\n");
}

export function contactThankYouText(input: { name: string; topic: string }) {
  const first = input.name.split(/\s+/)[0] || input.name;
  return [
    `Hi ${first},`,
    "",
    "Thank you for writing to Exhibium Group. We received your message and will follow up soon.",
    "",
    `Topic: ${input.topic}`,
    "",
    `Contact: ${contactEmail} · ${contactPhone}`,
    "",
    "— Exhibium Group",
    `(${contactEmail})`,
  ].join("\n");
}
