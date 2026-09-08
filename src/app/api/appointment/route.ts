import { NextResponse } from "next/server";
import {
  appointmentThankYouEmail,
  escapeHtml,
  getInboxTo,
  getWebsiteFromAddress,
  sendSiteEmail,
} from "@/lib/email";
import { verifyRecaptchaServer } from "@/lib/recaptcha";
import { saveFormSubmission } from "@/lib/forms-store";

type AppointmentBody = {
  captchaToken?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  duration?: string;
  format?: string;
  type?: string;
  notes?: string;
  visitorId?: number;
};

function required(value: unknown, label: string) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${label} is required.`);
  return text;
}

export async function POST(request: Request) {
  let body: AppointmentBody;
  try {
    body = (await request.json()) as AppointmentBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const captcha = await verifyRecaptchaServer(
      String(body.captchaToken || ""),
    );
    if (!captcha.ok) {
      return NextResponse.json(
        { error: captcha.error || "reCAPTCHA failed." },
        { status: 400 },
      );
    }

    const name = required(body.name, "Name");
    const email = required(body.email, "Email");
    const date = required(body.date, "Date");
    const time = required(body.time, "Time");
    const type = required(body.type, "Meeting focus");
    const company = String(body.company || "").trim();
    const phone = String(body.phone || "").trim();
    const duration = String(body.duration || "").trim() || "45 min";
    const format = String(body.format || "").trim() || "Video call";
    const notes = String(body.notes || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const websiteFrom = getWebsiteFromAddress();
    const adminTo = getInboxTo();

    const lines = [
      "New appointment request from the Exhibium website.",
      "",
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      `Preferred date: ${date}`,
      `Preferred time: ${time}`,
      `Duration: ${duration}`,
      `Format: ${format}`,
      `Meeting focus: ${type}`,
      notes ? `Context: ${notes}` : "",
    ].filter(Boolean);

    const subject = `Appointment request · ${type} · ${name}`;
    const html = `
      <h2>New appointment request</h2>
      <p>Submitted via the Exhibium website form.</p>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        ${company ? `<tr><td><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>` : ""}
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        ${phone ? `<tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>` : ""}
        <tr><td><strong>Date</strong></td><td>${escapeHtml(date)}</td></tr>
        <tr><td><strong>Time</strong></td><td>${escapeHtml(time)}</td></tr>
        <tr><td><strong>Duration</strong></td><td>${escapeHtml(duration)}</td></tr>
        <tr><td><strong>Format</strong></td><td>${escapeHtml(format)}</td></tr>
        <tr><td><strong>Focus</strong></td><td>${escapeHtml(type)}</td></tr>
        ${notes ? `<tr><td><strong>Context</strong></td><td>${escapeHtml(notes)}</td></tr>` : ""}
      </table>
      <p style="color:#5a6b82;font-size:13px">Reply to this email to contact the client directly (${escapeHtml(email)}).</p>
    `;

    // Persist for admin dashboard (even if email delivery fails later)
    await saveFormSubmission({
      formType: "appointment",
      name,
      email,
      phone,
      visitorId: Number(body.visitorId) || undefined,
      payload: {
        name,
        company,
        email,
        phone,
        date,
        time,
        duration,
        format,
        type,
        notes,
      },
    });

    // Admin: From = website email; Reply-To = customer (so reply goes to client)
    const adminSent = await sendSiteEmail({
      to: adminTo,
      subject,
      text: lines.join("\n"),
      html,
      fromAddress: websiteFrom,
      fromName: name,
      replyTo: email,
    });

    if (!adminSent.ok) {
      return NextResponse.json(
        { error: adminSent.error || "Could not send email." },
        { status: 503 },
      );
    }

    // Customer thank-you: From = website email
    const thanks = appointmentThankYouEmail({
      name,
      type,
      date,
      time,
      duration,
      format,
    });
    const thanksSent = await sendSiteEmail({
      to: email,
      subject: thanks.subject,
      text: thanks.text,
      html: thanks.html,
      fromAddress: websiteFrom,
      fromName: "Exhibium",
      replyTo: websiteFrom,
    });
    if (!thanksSent.ok) {
      console.error("Appointment thank-you failed:", thanksSent.error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not process request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
