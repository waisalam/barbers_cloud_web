import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { DownloadCta } from "@/components/sections/download-cta";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind BarbersCloud — why we built it and what we're working toward.",
};

const VALUES = [
  {
    title: "Built by people who get bad haircuts",
    body: "BarbersCloud started from a real frustration: calling four different barbershops, getting voicemail at three, waiting 45 minutes at the fourth. There had to be a better way. So we built it.",
  },
  {
    title: "Barbers deserve better tools",
    body: "Great barbers run on skill and reputation, not spreadsheets and phone calls. We built BarbersCloud so they can spend more time doing what they're best at — and less time managing logistics.",
  },
  {
    title: "Transparency over hype",
    body: "We show you real reviews from real bookings. We charge fair prices with no hidden fees. We tell you exactly how our platform works. That's the only way this works for everyone.",
  },
  {
    title: "Built for the long run",
    body: "We're not trying to flip this. We're building infrastructure for the barbershop industry — the kind of software that makes an entire category of local business dramatically better.",
  },
];

const TEAM = [
  { name: "Founder & CEO", description: "Serial entrepreneur with a background in marketplace apps." },
  { name: "Head of Product", description: "10 years building consumer mobile products at scale." },
  { name: "Head of Partnerships", description: "Former barbershop owner — knows the industry from the inside." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title="We're fixing how people find barbers"
        description="Finding a great barber shouldn't be a gamble. BarbersCloud makes it predictable, quick, and actually enjoyable."
      />

      {/* Mission */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="text-2xl font-medium text-foreground leading-relaxed">
            "Our mission is to make every haircut a great experience — for the customer getting it
            and the barber giving it."
          </p>
          <p className="mt-6 text-muted-foreground">
            We built BarbersCloud because we saw two problems happening at once: customers
            struggling to find and book a good barber, and talented barbers losing business
            to slow booking processes and no-shows. One platform fixes both.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What we believe</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background p-8"
              >
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">The team</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map(({ name, description }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-background p-6 text-center"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">✂️</span>
                </div>
                <h3 className="font-bold text-foreground">{name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DownloadCta />
    </>
  );
}
