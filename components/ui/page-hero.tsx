"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/animation-variants";

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
        >
          {label && (
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-500 mb-4"
            >
              {label}
            </motion.span>
          )}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold lg:text-6xl text-foreground"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
