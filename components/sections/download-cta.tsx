"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stagger, fadeUp } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

function AppStoreBadge({ store }: { store: "apple" | "google" }) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3",
        "hover:bg-white/20 transition-colors backdrop-blur-sm"
      )}
    >
      {store === "apple" ? (
        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.18 23.76c.34.19.73.24 1.1.14l11.29-6.52-2.5-2.5-9.89 8.88zM.43 1.5C.17 1.84 0 2.32 0 2.93v18.14c0 .61.17 1.09.44 1.43l.07.07 10.16-10.16v-.24L.5 1.43l-.07.07zM20.96 10.37l-2.89-1.67-2.81 2.81 2.81 2.81 2.9-1.68c.83-.48.83-1.26-.01-1.27zM4.28.1l11.29 6.52-2.5 2.5L3.18.24C3.52.04 3.94.09 4.28.1z" />
        </svg>
      )}
      <div className="text-left">
        <p className="text-[10px] text-white/70 leading-none">
          {store === "apple" ? "Download on the" : "Get it on"}
        </p>
        <p className="text-sm font-bold text-white leading-tight mt-0.5">
          {store === "apple" ? "App Store" : "Google Play"}
        </p>
      </div>
    </button>
  );
}

export function DownloadCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="download" className="py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative rounded-3xl bg-zinc-900 dark:bg-zinc-950 overflow-hidden px-8 py-16 lg:px-16 lg:py-20 text-center"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400"
          >
            Available now
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-6 text-4xl font-bold text-white lg:text-5xl"
          >
            Your next great haircut is{" "}
            <span className="gradient-text">two taps away</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 mx-auto max-w-xl text-zinc-400 text-lg"
          >
            Join 50,000+ customers who never wait for a barber again.
            Download free, find nearby barbers instantly.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <AppStoreBadge store="apple" />
            <AppStoreBadge store="google" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-xs text-zinc-600"
          >
            Free to download · No subscription required for customers
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
