"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string; // honeypot
}

type FormErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const initialFormData: FormData = { name: "", email: "", subject: "", message: "", company: "" };

const subjects = [
  { value: "general", label: "General inquiry" },
  { value: "feedback", label: "Feedback / suggestion" },
  { value: "bug", label: "Bug report" },
  { value: "partnership", label: "Partnership / business" },
  { value: "press", label: "Press / media" },
  { value: "other", label: "Other" },
];

const faqs = [
  {
    q: "Do you provide personalised financial advice?",
    a: "No. Fistotex is an educational and informational platform. We provide tools and information to help you make informed decisions, but we do not offer personalised financial advice. Please consult a qualified adviser for advice tailored to your situation.",
  },
  {
    q: "Are the calculator results guaranteed?",
    a: "No. All calculators provide estimates based on standard financial formulas and the inputs you provide. Actual results may vary due to market conditions, fees, taxes, policy changes and other factors.",
  },
  {
    q: "Where does your news come from?",
    a: "We aggregate headlines from Mint, Economic Times, Moneycontrol and Business Standard, and link every story to the original source. We don't rewrite or modify the news.",
  },
  {
    q: "Is my data collected when I use calculators?",
    a: "Calculator inputs are processed locally in your browser and never sent to us. If analytics is enabled, we collect anonymous usage data to improve the site. See our Privacy Policy for details.",
  },
];

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:opacity-50 aria-[invalid=true]:border-destructive";

function mailtoHref(d: FormData) {
  const subject = subjects.find((s) => s.value === d.subject)?.label ?? "Message";
  const body = `${d.message}\n\n— ${d.name} (${d.email})`;
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`[${siteConfig.name}] ${subject}`)}&body=${encodeURIComponent(body)}`;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "fallback">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [started, setStarted] = useState(false);

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Please enter a valid email address";
    if (!formData.subject) e.subject = "Please select a subject";
    if (!formData.message.trim()) e.message = "Message is required";
    else if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      analytics.formSubmit("contact", false);
      return;
    }

    setStatus("submitting");
    setSubmitMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setSubmitMessage("Thanks — your message has been sent. We'll reply within 1–2 business days.");
        setFormData(initialFormData);
        analytics.formSubmit("contact", true);
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (data.error === "not_configured" || data.error === "delivery_failed") {
        // Email delivery isn't available: hand the message to the visitor's email app
        setStatus("fallback");
        setSubmitMessage(
          `Our form couldn't send this message automatically. Please send it from your email app instead — we've filled it in for you.`
        );
      } else if (data.error === "rate_limited") {
        setStatus("error");
        setSubmitMessage("You've sent several messages in a short time. Please wait a few minutes and try again.");
      } else {
        setStatus("error");
        setSubmitMessage(`Something went wrong. Please try again, or email us at ${siteConfig.contactEmail}.`);
      }
      analytics.formSubmit("contact", false);
    } catch {
      setStatus("fallback");
      setSubmitMessage("We couldn't reach our server. You can send the message from your email app instead.");
      analytics.formSubmit("contact", false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!started) {
      setStarted(true);
      analytics.formStart("contact");
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "error" || status === "success") setStatus("idle");
  };

  const busy = status === "submitting";

  return (
    <>
      <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            {/* What to expect */}
            <div>
              <h1 className="font-masthead text-5xl text-foreground md:text-6xl">Write to us</h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
                A question about a formula, a rate that looks out of date, a calculator you&apos;d like us
                to build, or anything else.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="font-display break-all text-2xl text-foreground underline-offset-4 hover:text-accent hover:underline"
                    >
                      {siteConfig.contactEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">When you&apos;ll hear back</dt>
                  <dd className="mt-1 text-ink-2">Within two working days</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">What we do with your message</dt>
                  <dd className="mt-1 max-w-md text-ink-2">
                    We read it and reply. It isn&apos;t stored on the site, and we won&apos;t add you to a
                    mailing list.
                  </dd>
                </div>
              </dl>
            </div>

            {/* Form */}
            <div>
              <div className="surface p-6 md:p-9">
                <h2 className="font-display text-3xl text-foreground">Send a message</h2>
                <p className="mt-1 text-sm text-muted-foreground">All fields are required.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                  {/* Honeypot — hidden from people, visible to naive bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field id="name" label="Full name" error={errors.name}>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        disabled={busy}
                        className={inputClass}
                      />
                    </Field>
                    <Field id="email" label="Email address" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        disabled={busy}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field id="subject" label="Subject" error={errors.subject}>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      disabled={busy}
                      className={inputClass}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="message"
                    label="Message"
                    error={errors.message}
                    hint={`${formData.message.trim().length}/5000 · minimum 10 characters`}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      rows={6}
                      maxLength={5000}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : "message-hint"}
                      disabled={busy}
                      className={cn(inputClass, "resize-y")}
                    />
                  </Field>

                  <button type="submit" disabled={busy} className="btn-brand h-12 w-full px-8 text-sm disabled:opacity-70 md:w-auto">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {busy ? "Sending…" : "Send message"}
                  </button>

                  {status === "success" && (
                    <div role="status" className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <p>{submitMessage}</p>
                    </div>
                  )}

                  {status === "error" && (
                    <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <p>{submitMessage}</p>
                    </div>
                  )}

                  {status === "fallback" && (
                    <div role="alert" className="flex flex-col gap-3 rounded-lg border border-growth/50 bg-growth/10 p-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-growth-ink" />
                        {submitMessage}
                      </p>
                      <a href={mailtoHref(formData)} className="btn-brand h-10 shrink-0 px-4 text-sm">
                        <Mail className="h-4 w-4" />
                        Open email app
                      </a>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    By sending this form you agree to our{" "}
                    <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-accent">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-accent">
                      Terms
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-4xl text-foreground">Before you write</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-foreground">
                    {faq.q}
                    <Plus aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="max-w-prose pb-6 leading-relaxed text-ink-2">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
