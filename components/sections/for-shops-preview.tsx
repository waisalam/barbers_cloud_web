"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, BellOff, Globe, Star, Smartphone, ArrowRight, CheckCircle2,
} from "lucide-react";
import { stagger, fadeUp, slideLeft, slideRight } from "@/lib/animation-variants";
import { SectionHeading } from "@/components/ui/section-heading";

const BENEFITS = [
  { icon: TrendingUp, title: "More bookings, less downtime", description: "Fill your schedule automatically. Customers find you 24/7 even when you're busy cutting hair." },
  { icon: BellOff, title: "Slash no-shows by 80%", description: "Automated reminders keep your chair full. We notify clients 24h and 1h before their appointment." },
  { icon: Globe, title: "Online visibility", description: "Your shop appears on the map the moment you sign up. Get discovered by customers in your area you'd never reach otherwise." },
  { icon: Star, title: "Reviews that build trust", description: "Every completed booking prompts a review. Build your reputation automatically while you focus on cuts." },
  { icon: Smartphone, title: "Manage from your phone", description: "Accept, reschedule, or cancel bookings in seconds. Full calendar view — no laptop needed." },
];

const STAT_ITEMS = [
  { value: "3x", label: "average booking increase in month 1" },
  { value: "80%", label: "reduction in no-shows" },
  { value: "4.8★", label: "average shop rating on BarbersCloud" },
];

export function ForShopsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={stagger(0.08)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: stats card */}
            <motion.div variants={slideLeft} className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl border border-border bg-card p-8 overflow-hidden">
                {/* Amber glow */}
                <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl" />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Real results from our shops
                  </p>

                  <div className="mt-8 space-y-6">
                    {STAT_ITEMS.map(({ value, label }) => (
                      <div key={value} className="flex items-baseline gap-4">
                        <span className="text-5xl font-bold gradient-text leading-none">{value}</span>
                        <span className="text-sm text-muted-foreground leading-snug max-w-[180px]">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="text-base">✂️</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          "BarbersCloud changed my business."
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          "I went from 12 bookings a week to 40+ in just three weeks. The no-show protection alone paid for the subscription."
                        </p>
                        <p className="mt-2 text-xs font-medium text-amber-500">— Marcus T., The Sharp Edge, Atlanta</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: benefits */}
            <motion.div variants={slideRight} className="order-1 lg:order-2">
              <SectionHeading
                label="For Shop Owners"
                title="Turn your chair into a revenue machine"
                description="BarbersCloud puts your barbershop on the map — literally. More visibility, fewer no-shows, and a full booking calendar managed from your phone."
              />

              <ul className="mt-10 space-y-5">
                {BENEFITS.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/for-shops"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors hover:shadow-lg hover:shadow-amber-500/25"
                >
                  List my shop free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  View pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
