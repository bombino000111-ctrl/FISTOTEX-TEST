import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Fistotex. We'd love to hear your feedback, suggestions, or partnership inquiries.",
  openGraph: {
    title: "Contact Fistotex | Get in Touch",
    description: "Get in touch with Fistotex for feedback, suggestions, or partnership inquiries.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="WebPage" data={{ title: "Contact Us", description: "Get in touch with Fistotex for feedback, suggestions, or partnership inquiries." }} />
      <ContactForm />
    </div>
  );
}