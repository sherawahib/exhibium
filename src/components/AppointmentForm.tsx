"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Recaptcha,
  isRecaptchaConfigured,
} from "@/components/Recaptcha";
import { contactEmail, contactMailto, contactPhone, contactTel } from "@/lib/site";

const meetingTypes = [
  { id: "market-entry", label: "Market entry" },
  { id: "bim", label: "BIM / VDC" },
  { id: "modular", label: "Modular" },
  { id: "roi", label: "ROI / commercial" },
  { id: "general", label: "General consult" },
] as const;

const meetingFormats = [
  { id: "video", label: "Video call" },
  { id: "phone", label: "Phone" },
  { id: "in-person", label: "In person" },
] as const;

const durations = ["30 min", "45 min", "60 min"] as const;

export function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [type, setType] = useState<(typeof meetingTypes)[number]["id"] | "">(
    "",
  );
  const [format, setFormat] = useState<(typeof meetingFormats)[number]["id"]>(
    "video",
  );
  const [duration, setDuration] =
    useState<(typeof durations)[number]>("45 min");
  const [notes, setNotes] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const captchaRequired = isRecaptchaConfigured();

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCaptchaError("");

    if (!type) return;

    if (captchaRequired && !captchaToken) {
      setCaptchaError("Please complete the reCAPTCHA check.");
      return;
    }

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const date = String(data.get("date") || "").trim();
    const time = String(data.get("time") || "").trim();
    const selectedType =
      meetingTypes.find((t) => t.id === type)?.label || type;
    const selectedFormat =
      meetingFormats.find((f) => f.id === format)?.label || format;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captchaToken: captchaToken || "",
          name,
          company,
          email,
          phone,
          date,
          time,
          duration,
          format: selectedFormat,
          type: selectedType,
          notes,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setCaptchaToken(null);
        setCaptchaError(
          payload.error || "Could not send request. Please try again.",
        );
        return;
      }
      setStatus("sent");
    } catch {
      setCaptchaError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "sent") {
    return (
      <div className="appt-success" role="status">
        <p className="kicker">Request received</p>
        <h3>Your appointment request was sent.</h3>
        <p>
          We received your details at {contactEmail}. A thank-you confirmation
          was also sent to your email. Expect a reply to confirm availability.
          For urgent matters call <a href={contactTel}>{contactPhone}</a>.
        </p>
        <div className="appt-success-actions">
          <button
            type="button"
            className="cta cta-ink"
            onClick={() => {
              setStatus("idle");
              setCaptchaToken(null);
              setCaptchaError("");
            }}
          >
            Submit another request
          </button>
          <a className="cta cta-text" href={contactMailto}>
            Email directly →
          </a>
        </div>
      </div>
    );
  }

  const canSubmit =
    Boolean(type) && (!captchaRequired || Boolean(captchaToken)) && !submitting;

  return (
    <form className="appt-form" onSubmit={onSubmit}>
      <section className="appt-section">
        <div className="appt-section-head">
          <span>01</span>
          <h4>Your details</h4>
        </div>
        <div className="appt-grid">
          <label className="appt-field">
            <span>Full name *</span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Fernando Williams"
            />
          </label>
          <label className="appt-field">
            <span>Company</span>
            <input
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Organization"
            />
          </label>
          <label className="appt-field">
            <span>Work email *</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
          </label>
          <label className="appt-field">
            <span>Phone</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (786) 000-0000"
            />
          </label>
        </div>
      </section>

      <section className="appt-section">
        <div className="appt-section-head">
          <span>02</span>
          <h4>Schedule</h4>
        </div>
        <div className="appt-grid">
          <label className="appt-field">
            <span>Preferred date *</span>
            <input name="date" type="date" required min={minDate} />
          </label>
          <label className="appt-field">
            <span>Preferred time *</span>
            <input name="time" type="time" required />
          </label>
        </div>

        <div className="appt-field">
          <span>Duration</span>
          <div className="appt-chips" role="group" aria-label="Duration">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                className={`appt-chip${duration === d ? " is-on" : ""}`}
                aria-pressed={duration === d}
                onClick={() => setDuration(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="appt-field">
          <span>Meeting format</span>
          <div className="appt-chips" role="group" aria-label="Meeting format">
            {meetingFormats.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`appt-chip${format === f.id ? " is-on" : ""}`}
                aria-pressed={format === f.id}
                onClick={() => setFormat(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="appt-section">
        <div className="appt-section-head">
          <span>03</span>
          <h4>Focus area</h4>
        </div>

        <div className="appt-field">
          <span>What should we discuss? *</span>
          <div className="appt-chips appt-chips-wrap" role="group" aria-label="Meeting focus">
            {meetingTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`appt-chip${type === t.id ? " is-on" : ""}`}
                aria-pressed={type === t.id}
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {!type ? (
            <em className="appt-field-hint">Select one focus area to continue.</em>
          ) : null}
        </div>

        <label className="appt-field">
          <span>Brief context (optional)</span>
          <textarea
            name="notes"
            rows={4}
            maxLength={400}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Market, project stage, timeline, or decision you need support with"
          />
          <em className="appt-field-hint appt-field-count">
            {notes.length}/400
          </em>
        </label>
      </section>

      <section className="appt-section">
        <div className="appt-section-head">
          <span>04</span>
          <h4>Verification</h4>
        </div>
        <div className="appt-field">
          <span>Confirm you are human *</span>
          <Recaptcha
            onChange={(token) => {
              setCaptchaToken(token);
              setCaptchaError("");
            }}
          />
          {captchaError ? (
            <em className="appt-field-hint appt-captcha-error" role="alert">
              {captchaError}
            </em>
          ) : null}
        </div>
      </section>

      <div className="appt-form-foot">
        <p className="appt-form-note">
          Submitting sends your request to {contactEmail}. We confirm
          availability by reply.
        </p>
        <button
          type="submit"
          className="cta cta-fill cta-lg appt-submit"
          disabled={!canSubmit}
        >
          {submitting ? "Sending…" : "Send appointment request"}
        </button>
      </div>
    </form>
  );
}
