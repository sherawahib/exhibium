"use client";

import { useState, type FormEvent } from "react";

const meetingTypes = [
  "Strategy consultation",
  "Retail / branding review",
  "BIM advisory",
  "Modular development",
  "Market entry discussion",
] as const;

export function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const date = String(data.get("date") || "").trim();
    const time = String(data.get("time") || "").trim();
    const type = String(data.get("type") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    const subject = encodeURIComponent(`Appointment request — ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Preferred date: ${date}`,
        `Preferred time: ${time}`,
        `Meeting type: ${type}`,
        notes ? `Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:info@exhibium.com?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="appt-success" role="status">
        <h3>Request ready</h3>
        <p>
          Your email app should open with the appointment details. If it doesn’t,
          write to{" "}
          <a href="mailto:info@exhibium.com">info@exhibium.com</a>.
        </p>
        <button
          type="button"
          className="cta cta-ink"
          onClick={() => setStatus("idle")}
        >
          Book another time
        </button>
      </div>
    );
  }

  return (
    <form className="appt-form" onSubmit={onSubmit} noValidate>
      <div className="appt-grid">
        <label className="appt-field">
          <span>Full name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="appt-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
        <label className="appt-field">
          <span>Preferred date</span>
          <input name="date" type="date" required />
        </label>
        <label className="appt-field">
          <span>Preferred time</span>
          <input name="time" type="time" required />
        </label>
      </div>

      <label className="appt-field">
        <span>Meeting type</span>
        <select name="type" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {meetingTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="appt-field">
        <span>Brief note (optional)</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={280}
          placeholder="What would you like to discuss?"
        />
      </label>

      <button type="submit" className="cta cta-fill cta-lg appt-submit">
        Confirm appointment request
      </button>
    </form>
  );
}
