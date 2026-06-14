"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin, Clock, Star, Bell, CreditCard, Shield, BarChart2, MessageCircle,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/animation-variants";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: MapPin, title: "Live map", description: "Real-time barber locations and availability. See who's busy, who's free, and how far they are." },
  { icon: Clock, title: "Instant booking", description: "Book in seconds. No phone tag, no \"we'll call you back.\" Confirmed immediately." },
  { icon: Star, title: "Verified reviews", description: "Every review comes from a real completed booking. No fake stars, no gaming the system." },
  { icon: Bell, title: "Smart reminders", description: "Customers get notified 24h and 1h before. Barbers see their schedule update in real-time." },
  { icon: CreditCard, title: "Easy payments", description: "Customers can pay in-app or at the chair. Shops receive payouts automatically." },
  { icon: Shield, title: "No-show protection", description: "Booking deposits and cancellation policies protect your time and income." },
  { icon: BarChart2, title: "Shop analytics", description: "See peak hours, popular services, and revenue trends — all from your phone." },
  { icon: MessageCircle, title: "In-app messaging", description: "Customers can message their barber directly, confirm details, or ask questions." },
];

export function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={stagger(0.06)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="text-center">
            <SectionHeading
              label="Features"
              title="Everything a barbershop needs"
              description="Built for both sides of the chair — customers get simplicity, shop owners get power."
              center
            />
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className={cn(
                  "group relative rounded-2xl border border-border bg-background p-6",
                  "hover:border-amber-500/30 hover:-translate-y-1",
                  "transition-all duration-300",
                  // Span first feature wider
                  i === 0 && "sm:col-span-2 lg:col-span-2"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors mb-4">
                  <feature.icon className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
