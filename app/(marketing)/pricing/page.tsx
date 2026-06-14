import type { Metadata } from "next";
import { PricingCards } from "@/components/sections/pricing-cards";
import { PageHero } from "@/components/ui/page-hero";
import { PLANS, ALL_FEATURES } from "@/lib/plans";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple subscription pricing for barbershops. Every feature included — pick your duration.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="Pricing"
        title="Every feature. Every plan."
        description="No tiers, no locked features. Pick how long you subscribe — that's it."
      />

      <PricingCards showAll />

      {/* What's included */}
      <section className="py-16 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Everything included in every plan
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            All features are available from day one, regardless of which duration you choose.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {ALL_FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4"
              >
                <Check className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>

          {/* Savings summary table */}
          <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Plan</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Total</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Per month</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">You save</th>
                </tr>
              </thead>
              <tbody>
                {PLANS.map((plan, i) => (
                  <tr
                    key={plan.name}
                    className={cn(
                      "border-b border-border/50 last:border-0",
                      plan.highlight ? "bg-amber-500/5" : i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-semibold",
                          plan.highlight ? "text-amber-500" : "text-foreground"
                        )}>
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-foreground">
                      {plan.price}
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-foreground">
                      {plan.perMonth}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {plan.savings ? (
                        <span className="text-sm font-semibold text-amber-500">{plan.savings}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            All prices in INR. Subscriptions activate immediately on payment.{" "}
            <a href="/contact" className="text-amber-500 hover:underline">
              Contact us
            </a>{" "}
            for bulk or enterprise pricing.
          </p>
        </div>
      </section>
    </>
  );
}
