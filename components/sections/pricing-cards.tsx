"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { stagger, fadeUp } from "@/lib/animation-variants";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { PLANS, ALL_FEATURES } from "@/lib/plans";

export function PricingCards({ showAll = false }: { showAll?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="text-center">
            <SectionHeading
              label="Pricing"
              title="One plan, every feature"
              description="All features included in every subscription. Choose the duration that works for you — longer saves more."
              center
            />
          </motion.div>

          {/* Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 transition-all duration-300",
                  plan.highlight
                    ? "border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10 scale-[1.02]"
                    : "border-border bg-background hover:border-amber-500/30 hover:-translate-y-1"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                      {plan.highlight && <Zap className="h-3 w-3" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className={cn(
                      "text-5xl font-bold tracking-tight",
                      plan.highlight ? "gradient-text" : "text-foreground"
                    )}>
                      {plan.price}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">{plan.period}</p>

                  {/* Per-month breakdown */}
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                    <span className="text-xs font-semibold text-foreground">{plan.perMonth}/month</span>
                    {plan.savings && (
                      <span className="text-xs text-amber-500 font-medium">· saves {plan.savings}</span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features — show subset inline, full list on pricing page */}
                <ul className="mt-8 flex-1 space-y-2.5">
                  {(showAll ? ALL_FEATURES : ALL_FEATURES.slice(0, 6)).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                  {!showAll && (
                    <li className="text-xs text-muted-foreground pt-1">
                      + {ALL_FEATURES.length - 6} more features included
                    </li>
                  )}
                </ul>

                <Link
                  href="/contact"
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold transition-all duration-200",
                    plan.highlight
                      ? "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30"
                      : "border border-border text-foreground hover:bg-accent"
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Value comparison bar */}
          <motion.div
            variants={fadeUp}
            className="mt-12 rounded-2xl border border-border bg-muted/40 p-6"
          >
            <p className="text-center text-sm font-semibold text-foreground mb-5">
              Cost per month — the longer you subscribe, the less you pay
            </p>
            <div className="flex items-end justify-center gap-6">
              {PLANS.map((plan) => {
                const heights = { "3 Months": "h-20", "6 Months": "h-14", "1 Year": "h-8" } as Record<string, string>;
                return (
                  <div key={plan.name} className="flex flex-col items-center gap-2">
                    <span className={cn(
                      "text-sm font-bold",
                      plan.highlight ? "text-amber-500" : "text-foreground"
                    )}>
                      {plan.perMonth}
                    </span>
                    <div className={cn(
                      "w-16 rounded-t-lg transition-all",
                      heights[plan.name],
                      plan.highlight ? "bg-amber-500" : "bg-border"
                    )} />
                    <span className="text-xs text-muted-foreground text-center leading-tight">
                      {plan.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {!showAll && (
            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                See all included features →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
