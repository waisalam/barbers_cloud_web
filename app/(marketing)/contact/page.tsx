import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the BarbersCloud team. We typically respond within 24 hours.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@barberscloud.com",
    href: "mailto:hello@barberscloud.com",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Available worldwide",
    href: null,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Get in touch"
        description="Whether you're a customer, a shop owner, or just curious — we'd love to hear from you."
      />

      <section className="py-16 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left: info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">We're here to help</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Have a question about BarbersCloud? Want to list your barbershop?
                  Something else on your mind? Use the form or reach out directly.
                </p>
              </div>

              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 text-sm font-medium text-foreground hover:text-amber-500 transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shop owner callout */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <p className="text-sm font-bold text-foreground">Own a barbershop?</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select "I want to list my shop" in the form and we'll fast-track your
                  onboarding. Getting listed takes under 10 minutes.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card p-8 lg:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
