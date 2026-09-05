"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { analytics } from "@/lib/analytics";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "feedback", label: "Feedback / Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "partnership", label: "Partnership / Business" },
  { value: "press", label: "Press / Media" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analytics.formStart("contact");

    if (!validateForm()) {
      analytics.formSubmit("contact", false);
      return;
    }

    setStatus("submitting");
    setSubmitMessage("");

    try {
      // In production, replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
      setSubmitMessage("Thank you for your message! We'll get back to you within 24-48 hours.");
      setFormData(initialFormData);
      analytics.formSubmit("contact", true);
    } catch {
      setStatus("error");
      setSubmitMessage("Something went wrong. Please try again or email us directly at " + siteConfig.contactEmail);
      analytics.formSubmit("contact", false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions, feedback, or ideas? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <h3 className="text-xl font-semibold text-primary">Get in Touch</h3>
                  <p className="text-muted-foreground">
                    We typically respond within 24-48 hours during business days.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 text-primary flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Email</h4>
                        <a href={`mailto:${siteConfig.contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {siteConfig.contactEmail}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 text-primary flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Address</h4>
                        <p className="text-muted-foreground">
                          {siteConfig.businessAddress || "India"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Quick Links</h3>
                  <div className="space-y-3">
                    <a href="/toolkit/finance-calculator" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Send className="h-4 w-4" />
                      Explore Calculators
                    </a>
                    <a href="/news" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Send className="h-4 w-4" />
                      Read Latest News
                    </a>
                    <a href="/about" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Send className="h-4 w-4" />
                      Learn About Us
                    </a>
                    <a href="/disclaimer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Send className="h-4 w-4" />
                      Read Disclaimer
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          disabled={status === "submitting"}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-sm text-destructive" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          disabled={status === "submitting"}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-sm text-destructive" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                        disabled={status === "submitting"}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p id="subject-error" className="text-sm text-destructive" role="alert">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : "message-hint"}
                        disabled={status === "submitting"}
                      />
                      {errors.message ? (
                        <p id="message-error" className="text-sm text-destructive" role="alert">
                          {errors.message}
                        </p>
                      ) : (
                        <p id="message-hint" className="text-sm text-muted-foreground">
                          Minimum 10 characters
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={status === "submitting"}>
                      {status === "submitting" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {status === "submitting" ? "Sending..." : "Send Message"}
                    </Button>

                    {status === "success" && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{submitMessage}</p>
                      </div>
                    )}

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{submitMessage}</p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our{" "}
                      <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>
                      {" "}and{" "}
                      <a href="/terms-and-conditions" className="underline hover:text-primary">Terms of Service</a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do you provide personalized financial advice?",
                  a: "No, Fistotex is an educational and informational platform. We provide tools and information to help you make informed decisions, but we do not offer personalized financial advice. Please consult a qualified financial advisor for advice tailored to your situation.",
                },
                {
                  q: "Are the calculator results guaranteed?",
                  a: "No. All calculators provide estimates based on standard financial formulas and the inputs you provide. Actual results may vary due to market conditions, fees, taxes, policy changes, and other factors.",
                },
                {
                  q: "Where does your news come from?",
                  a: "We aggregate financial news from trusted Indian publications including Mint, Moneycontrol, and Economic Times. We link to the original sources - we don't create or modify the news content.",
                },
                {
                  q: "How can I report a bug or suggest a feature?",
                  a: "Use the contact form above with 'Bug Report' or 'Feedback / Suggestion' as the subject. You can also email us directly at " + siteConfig.contactEmail,
                },
                {
                  q: "Is my data collected when I use calculators?",
                  a: "Calculator inputs are processed locally in your browser. We don't store your calculation data. We only collect anonymous usage analytics via Google Analytics 4 to improve the site. See our Privacy Policy for details.",
                },
              ].map((faq, index) => (
                <details key={index} className="group border rounded-lg bg-card">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-medium text-primary pr-4">{faq.q}</span>
                    <span className="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-muted-foreground border-t">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}