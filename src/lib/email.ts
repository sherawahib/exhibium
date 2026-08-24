import { contactEmail, contactPhone } from "@/lib/site";

export type OutboundEmail = {
  to?: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
};

/** Sender shown to recipients — website inbox address. */
export function getEmailFrom() {
  return (
    process.env.EMAIL_FROM?.trim() || `Exhibium <${contactEmail}>`
  );
}

export function getInboxTo() {
  return process.env.EMAIL_TO?.trim() || contactEmail;
}

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

  const to = mail.to ?? getInboxTo();
  const recipients = Array.isArray(to) ? to : [to];
  const from = getEmailFrom();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      reply_to: mail.replyTo || contactEmail,
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

export function appointmentThankYouEmail(input: {
  name: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  format: string;
}) {
  const first = input.name.split(/\s+/)[0] || input.name;
  const subject = "Thank you — we received your Exhibium appointment request";
  const text = [
    `Hi ${first},`,
    "",
    "Thank you for contacting Exhibium Group. We have received your appointment request and will confirm availability by reply.",
    "",
    "Summary:",
    `• Focus: ${input.type}`,
    `• Preferred date: ${input.date}`,
    `• Preferred time: ${input.time}`,
    `• Duration: ${input.duration}`,
    `• Format: ${input.format}`,
    "",
    `If you need to reach us sooner, email ${contactEmail} or call ${contactPhone}.`,
    "",
    "— Exhibium Group",
  ].join("\n");

  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.55;color:#0b1d3a">
      <p>Hi ${escapeHtml(first)},</p>
      <p>Thank you for contacting <strong>Exhibium Group</strong>. We have received your appointment request and will confirm availability by reply.</p>
      <p><strong>Summary</strong></p>
      <ul>
        <li>Focus: ${escapeHtml(input.type)}</li>
        <li>Preferred date: ${escapeHtml(input.date)}</li>
        <li>Preferred time: ${escapeHtml(input.time)}</li>
        <li>Duration: ${escapeHtml(input.duration)}</li>
        <li>Format: ${escapeHtml(input.format)}</li>
      </ul>
      <p>If you need to reach us sooner, email <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> or call ${escapeHtml(contactPhone)}.</p>
      <p>— Exhibium Group</p>
    </div>
  `;

  return { subject, text, html };
}

export function contactThankYouEmail(input: {
  name: string;
  topic: string;
}) {
  const first = input.name.split(/\s+/)[0] || input.name;
  const subject = "Thank you — we received your message to Exhibium";
  const text = [
    `Hi ${first},`,
    "",
    "Thank you for writing to Exhibium Group. We received your message and will follow up soon.",
    "",
    `Topic: ${input.topic}`,
    "",
    `You can also reach us at ${contactEmail} or ${contactPhone}.`,
    "",
    "— Exhibium Group",
  ].join("\n");

  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.55;color:#0b1d3a">
      <p>Hi ${escapeHtml(first)},</p>
      <p>Thank you for writing to <strong>Exhibium Group</strong>. We received your message and will follow up soon.</p>
      <p><strong>Topic:</strong> ${escapeHtml(input.topic)}</p>
      <p>You can also reach us at <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> or ${escapeHtml(contactPhone)}.</p>
      <p>— Exhibium Group</p>
    </div>
  `;

  return { subject, text, html };
}
