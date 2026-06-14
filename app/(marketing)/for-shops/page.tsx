import type { Metadata } from "next";
import { ForShopsPreview } from "@/components/sections/for-shops-preview";
import { PricingCards } from "@/components/sections/pricing-cards";
import { PageHero } from "@/components/ui/page-hero";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "For Shop Owners",
  description: "Grow your barbershop with BarbersCloud. More bookings, fewer no-shows, full calendar managed from your phone.",
};

const HOW_IT_WORKS_SHOP = [
  {
    title: "Create your free profile",
    body: "Sign up, add your shop details, upload photos, set your services and prices. Your shop goes live on the map in minutes — no technical skills needed.",
  },
  {
    title: "Customers discover and book you",
    body: "Anyone using BarbersCloud in your area will see your shop on the live map. They browse your profile, check availability, and book directly. You get notified instantly.",
  },
  {
    title: "Manage everything from your phone",
    body: "View your upcoming appointments, accept or reschedule bookings, message customers, and update your availability — all from the BarbersCloud shop owner app.",
  },
  {
    title: "Get paid, build your reputation",
    body: "Payments are handled in-app or at the chair. Every completed booking auto-prompts a review, building your star rating over time and attracting new customers.",
  },
];

const OWNER_FEATURES = [
  "Real-time booking calendar",
  "Automated customer reminders",
  "No-show deposits & policies",
  "Multi-barber staff management",
  "Service & price management",
  "Customer messaging",
  "Revenue analytics",
  "Custom availability hours",
  "Cancellation management",
  "Review management dashboard",
  "Featured listing placement",
  "Walk-in queue management",
];

export default function ForShopsPage() {
  return (
    <>
      <PageHero
        label="For Shop Owners"
        title="Grow your shop with BarbersCloud"
        description="Join 2,000+ barbershops already using BarbersCloud to fill their calendars, reduce no-shows, and earn more — without lifting a finger."
      />

      <ForShopsPreview />

      {/* How it works for shops */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-16 text-center">
            Getting started is simple
          </h2>
          <div className="space-y-12">
            {HOW_IT_WORKS_SHOP.map(({ title, body }, i) => (
              <div key={title} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Everything you need to run a modern shop
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OWNER_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingCards />
    </>
  );
}
