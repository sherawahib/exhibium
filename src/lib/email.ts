import nodemailer from "nodemailer";
import { contactEmail, contactPhone } from "@/lib/site";

export type OutboundEmail = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  /** Visible From address (defaults to website inbox). */
  fromAddress?: string;
  /** Visible From name. */
  fromName?: string;
  /** Reply-To (e.g. customer email for admin notifications). */
  replyTo?: string;
};

export function getInboxTo() {
  return process.env.EMAIL_TO?.trim() || contactEmail;
}

export function getWebsiteFromAddress() {
  return process.env.EMAIL_FROM_ADDRESS?.trim() || contactEmail;
}

function smtpConfig() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim().replace(/\s+/g, "");
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;

  if (!user || !pass) {
    return null;
  }

  return { user, pass, host, port, secure };
}

/**
 * Sends via Gmail SMTP.
 * Visible From = website email (fwilliams@exhibium.com), not the SMTP login.
 * Note: Gmail must allow “Send mail as” for that From address, or Gmail may rewrite it.
 */
export async function sendSiteEmail(
  mail: OutboundEmail,
): Promise<{ ok: boolean; error?: string }> {
  const smtp = smtpConfig();
  if (!smtp) {
    return {
      ok: false,
      error: "Email SMTP is not configured (SMTP_USER / SMTP_PASS).",
    };
  }

  const fromAddress = mail.fromAddress || getWebsiteFromAddress();
  const fromName = mail.fromName || "Exhibium";
  const to = Array.isArray(mail.to) ? mail.to : [mail.to];

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: { name: fromName, address: fromAddress },
      to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo || fromAddress,
      // Keep SMTP envelope on the authenticated Gmail account
      envelope: {
        from: smtp.user,
        to,
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("SMTP send error:", err);
    return {
      ok: false,
      error: "Failed to send email. Please try again or email us directly.",
    };
  }
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

  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.55;color:#0b1d3a">
      <p>Hi ${escapeHtml(first)},</p>
      <p>Thank you for contacting <strong>Exhibium Group</strong>. We received your appointment request and will confirm availability by reply.</p>
      <p><strong>Summary</strong></p>
      <ul>
        <li>Focus: ${escapeHtml(input.type)}</li>
        <li>Preferred date: ${escapeHtml(input.date)}</li>
        <li>Preferred time: ${escapeHtml(input.time)}</li>
        <li>Duration: ${escapeHtml(input.duration)}</li>
        <li>Format: ${escapeHtml(input.format)}</li>
      </ul>
      <p>Reply to this email or write <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> · ${escapeHtml(contactPhone)}</p>
      <p>— Exhibium Group</p>
    </div>
  `;

  return { subject, text, html };
}

export function contactThankYouEmail(input: { name: string; topic: string }) {
  const first = input.name.split(/\s+/)[0] || input.name;
  const subject = "Thank you — we received your message to Exhibium";
  const text = [
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

  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.55;color:#0b1d3a">
      <p>Hi ${escapeHtml(first)},</p>
      <p>Thank you for writing to <strong>Exhibium Group</strong>. We received your message and will follow up soon.</p>
      <p><strong>Topic:</strong> ${escapeHtml(input.topic)}</p>
      <p>Contact: <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> · ${escapeHtml(contactPhone)}</p>
      <p>— Exhibium Group</p>
    </div>
  `;

  return { subject, text, html };
}
