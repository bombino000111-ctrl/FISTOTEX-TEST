"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
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
      {/* Hero */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-12 text-center md:py-16">
          <p className="eyebrow eyebrow-plain mb-4 justify-center">Contact</p>
          <h1 className="font-display mx-auto max-w-3xl text-4xl text-foreground md:text-6xl">
            Let&apos;s <span className="text-accent">talk</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Questions, feedback, a calculator you&apos;d like to see, or a partnership idea — we read every message.
          </p>
        </div>
      </div>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-5 lg:col-span-1">
              {[
                {
                  icon: Mail,
                  tint: "#10B981",
                  title: "Email",
                  body: (
                    <a href={`mailto:${siteConfig.contactEmail}`} className="break-all hover:text-accent">
                      {siteConfig.contactEmail}
                    </a>
                  ),
                },
                { icon: Clock, tint: "#6366F1", title: "Response time", body: "Within 1–2 business days" },
                { icon: MapPin, tint: "#F59E0B", title: "Based in", body: siteConfig.businessAddress || "India" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="surface flex items-start gap-4 p-5"
                    style={{ "--tint": item.tint } as React.CSSProperties}
                  >
                    <span className="icon-tile h-11 w-11 shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-bold text-foreground">{item.title}</h2>
                      <div className="mt-0.5 text-sm text-muted-foreground">{item.body}</div>
                    </div>
                  </div>
                );
              })}

              <div className="surface p-5">
                <h2 className="font-bold text-foreground">Quick links</h2>
                <div className="mt-3 space-y-1">
                  {[
                    { href: "/toolkit/finance-calculator", label: "Explore calculators" },
                    { href: "/news", label: "Read the latest news" },
                    { href: "/about", label: "About Fistotex" },
                    { href: "/disclaimer", label: "Disclaimer" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {l.label}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="surface p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
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
                    <div role="alert" className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
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
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/50 py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display mb-8 text-center text-3xl text-foreground">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="surface group px-5 py-4 open:border-brand/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                    {faq.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-open:rotate-45 group-open:bg-brand group-open:text-white">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
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
