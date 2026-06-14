import type { Metadata } from "next";
import { HowItWorksPreview } from "@/components/sections/how-it-works-preview";
import { DownloadCta } from "@/components/sections/download-cta";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how BarbersCloud makes finding and booking a barber as easy as ordering a ride.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        label="For Customers"
        title="How BarbersCloud works"
        description="From download to confirmed booking in under a minute. Here's exactly how it works."
      />
      <HowItWorksPreview />

      {/* Extended detail */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-16">
          {[
            {
              step: "Step 1",
              title: "Open the live map",
              body: "The moment you open BarbersCloud, you see a live map showing every partner barbershop near you. Each pin shows the shop name, star rating, and current wait time. Zoom in or out, use filters to narrow by distance, price range, or services offered.",
            },
            {
              step: "Step 2",
              title: "Pick your barber and service",
              body: "Tap a pin to open the shop profile. You'll see photos of the space, a full service menu with prices, real reviews from verified customers, the barbers who work there, and their real-time availability calendar. No surprises.",
            },
            {
              step: "Step 3",
              title: "Book in two taps",
              body: "Choose your service and pick a time slot. Tap confirm — you're booked. You get an instant confirmation with all the details. An automated reminder goes out 24 hours and 1 hour before your appointment so you never forget.",
            },
            {
              step: "After your cut",
              title: "Leave a review",
              body: "Once your appointment is marked complete, BarbersCloud prompts you to rate your experience. Your review helps other customers find great barbers and helps shops build their reputation. Honest, verified, always real.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-8">
              <div className="hidden sm:block w-24 shrink-0 text-right">
                <span className="text-sm font-semibold text-amber-500">{step}</span>
              </div>
              <div className="border-l border-border pl-8">
                <span className="sm:hidden text-xs font-semibold text-amber-500 block mb-1">{step}</span>
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DownloadCta />
    </>
  );
}
