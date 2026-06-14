"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MapPin, CalendarCheck, Scissors, ArrowRight } from "lucide-react";
import { stagger, fadeUp } from "@/lib/animation-variants";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    icon: MapPin,
    title: "Open the map",
    description:
      "Launch BarbersCloud and instantly see all available barbers near you on a live map. Real-time positions, wait times, and availability — all in one view.",
  },
  {
    number: "02",
    icon: Scissors,
    title: "Pick your barber",
    description:
      "Tap any pin to view their profile: services, prices, reviews, photos, and live availability. Filter by distance, rating, or price.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Book in two taps",
    description:
      "Select your service and time slot — get an instant confirmation. No phone calls, no walking in to check, no uncertainty.",
  },
];

export function HowItWorksPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              label="How It Works"
              title="Great haircuts, zero hassle"
              description="Three steps and you're booked. We built BarbersCloud so finding and booking a barber is as easy as ordering a ride."
              center
            />
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                className="relative"
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-[calc(100%-1rem)] hidden md:block w-[calc(100%-2rem)] h-px bg-gradient-to-r from-border to-transparent" />
                )}

                <div className={cn(
                  "group rounded-2xl border border-border bg-background p-8",
                  "hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5",
                  "transition-all duration-300"
                )}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                      <step.icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="mt-1 text-4xl font-bold text-muted-foreground/20 leading-none select-none">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-600 transition-colors"
            >
              See the full walkthrough <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
