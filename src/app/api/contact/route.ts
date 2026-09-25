import { z } from "zod";
import { siteConfig } from "@/config/site";

/**
 * Contact form endpoint. Delivers messages by email through Resend's REST API
 * (https://resend.com) — no SDK needed.
 *
 * Required env on Vercel:
 *   RESEND_API_KEY      — API key from resend.com
 * Optional:
 *   CONTACT_TO_EMAIL    — inbox that receives messages (defaults to CONTACT_EMAIL)
 *   CONTACT_FROM_EMAIL  — verified sender, e.g. "Fistotex <hello@fistotex.com>"
 *
 * Without RESEND_API_KEY this returns 503 and the form falls back to the
 * visitor's email app, so a message is never silently dropped.
 */

const subjects = ["general", "feedback", "bug", "partnership", "press", "other"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Please enter a valid email address").max(200),
  subject: z.enum(subjects),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot: real visitors never see or fill this field
  company: z.string().max(0).optional().or(z.literal("")),
});

// Best-effort per-instance rate limit: 5 messages per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // A filled honeypot means a bot: pretend success so it doesn't retry
    if ((body as { company?: string })?.company) return Response.json({ ok: true });
    return Response.json(
      { error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const { name, email, subject, message } = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contactEmail;
  const from = process.env.CONTACT_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[${siteConfig.name} contact] ${subject} — ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br/><strong>Subject:</strong> ${escapeHtml(subject)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[contact] email delivery failed", res?.status, res ? await res.text().catch(() => "") : "network");
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
