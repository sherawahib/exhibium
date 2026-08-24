import { NextResponse } from "next/server";
import { escapeHtml, sendSiteEmail } from "@/lib/email";

type ContactBody = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const topic = String(body.topic || "General").trim() || "General";
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const subject = `Website chatbot · ${topic} · ${name}`;
  const text = [
    "New message from the Exhibium help chatbot.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    "",
    message,
  ].join("\n");

  const html = `
    <h2>Chatbot message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
    <strong>Email:</strong> ${escapeHtml(email)}<br/>
    <strong>Topic:</strong> ${escapeHtml(topic)}</p>
    <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
  `;

  const sent = await sendSiteEmail({
    subject,
    text,
    html,
    replyTo: email,
  });

  if (!sent.ok) {
    return NextResponse.json(
      { error: sent.error || "Could not send email." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
