"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, X, Send, Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Site-wide feedback widget. Floating button opens a small panel; submissions
 * go to /api/feedback, which emails them to the team inbox. If email delivery
 * is not configured on the server, the widget hands the note to the visitor's
 * own email app instead, so feedback is never silently dropped.
 */
export function FeedbackWidget() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot
  const [status, setStatus] = React.useState<Status>("idle");
  const [emailFallback, setEmailFallback] = React.useState(false);
  const pathname = usePathname();

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 3 || status === "sending") return;
    setStatus("sending");
    setEmailFallback(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          page: pathname,
          company,
        }),
      });
      if (res.status === 503) {
        // Email delivery isn't configured server-side: offer the mailto fallback
        setEmailFallback(true);
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(`feedback failed: ${res.status}`);
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const mailto = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    `[${siteConfig.name} feedback] on ${pathname}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Send feedback"
        hidden={!open}
        className="fixed bottom-20 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-md border border-border bg-background p-5 shadow-[0_8px_30px_rgb(0_0_0/0.18)]"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">Send feedback</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Broken, confusing or missing? Tell us. No tracking — your note goes straight to our
              inbox.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close feedback"
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "sent" ? (
          <div className="flex items-center gap-2 rounded-sm border border-border bg-muted/50 p-3 text-sm text-foreground">
            <Check className="h-4 w-4 shrink-0 text-accent" />
            Thanks — your feedback is in our inbox.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={3}
              maxLength={2000}
              rows={4}
              placeholder="What should we fix or build next?"
              aria-label="Your feedback"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional - only if you want a reply)"
              aria-label="Email (optional)"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
            {/* Honeypot: hidden from real visitors */}
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              name="company"
            />
            {status === "error" && (
              <p className="text-xs text-destructive">
                {emailFallback ? (
                  <>
                    We can&apos;t receive this automatically yet.{" "}
                    <a href={mailto} className="font-semibold underline">
                      Send it from your email app instead
                    </a>{" "}
                    — we&apos;ve filled it in for you.
                  </>
                ) : (
                  "Something went wrong. Please try again."
                )}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending" || message.trim().length < 3}
              className={cn(
                "btn-brand h-9 w-full text-xs",
                (status === "sending" || message.trim().length < 3) && "cursor-not-allowed opacity-50"
              )}
            >
              {status === "sending" ? "Sending…" : "Send feedback"}
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close feedback panel" : "Give feedback"}
        className="btn-brand fixed bottom-4 right-4 z-40 h-10 gap-1.5 px-3.5 font-mono text-xs font-bold uppercase tracking-wide shadow-[0_4px_16px_rgb(0_0_0/0.2)]"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback
      </button>
    </>
  );
}
