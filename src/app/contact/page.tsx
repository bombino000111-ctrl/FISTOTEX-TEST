import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import ContactForm from "./contact-form";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Questions, feedback or a calculator you'd like us to build? Contact the Fistotex team. We read every message and reply within two business days.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="WebPage" data={{ title: "Contact Us", url: "/contact", description: "Get in touch with Fistotex for feedback, suggestions, or partnership inquiries." }} />
      <ContactForm />
    </div>
  );
}
