"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Clock, Shield } from "lucide-react";
import { stagger, fadeUp, scaleIn, EASE_OUT_EXPO } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "50k+", label: "Active Users" },
  { value: "2k+", label: "Partner Shops" },
  { value: "4.9", label: "App Store Rating" },
  { value: "98%", label: "Booking Success" },
];

// CSS phone mockup — replaced by R3F model in Step 3
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-64 lg:w-72">
      {/* Glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-amber-500/20 blur-3xl scale-110" />

      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-2 border-white/10 bg-zinc-900 shadow-2xl overflow-hidden aspect-[9/19]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[10px] text-white/60 font-medium">9:41</span>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn("h-1.5 w-0.5 rounded-sm bg-white", i < 3 ? "opacity-100" : "opacity-30")} />
            ))}
          </div>
        </div>

        {/* Map background */}
        <div className="relative mx-3 mb-3 rounded-2xl overflow-hidden bg-zinc-800 h-48">
          {/* Fake map grid */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 160">
            {[...Array(8)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 22} x2="200" y2={i * 22} stroke="#fff" strokeWidth="0.5" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`v${i}`} x1={i * 22} y1="0" x2={i * 22} y2="160" stroke="#fff" strokeWidth="0.5" />
            ))}
          </svg>

          {/* Animated pins */}
          {[
            { cx: "40%", cy: "35%", delay: 0 },
            { cx: "65%", cy: "55%", delay: 0.4 },
            { cx: "25%", cy: "65%", delay: 0.8 },
          ].map((pin, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: pin.cx, top: pin.cy }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, delay: pin.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative -translate-x-1/2 -translate-y-full">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg">
                  <MapPin className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-amber-500" />
              </div>
            </motion.div>
          ))}

          {/* User location dot */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/30" />
          </motion.div>
        </div>

        {/* Barber cards */}
        <div className="px-3 space-y-2">
          {[
            { name: "The Classic Cut", dist: "0.3 km", rating: 4.9, time: "2 min" },
            { name: "Sharp Edge Studio", dist: "0.7 km", rating: 4.8, time: "5 min" },
          ].map((shop) => (
            <div key={shop.name} className="flex items-center gap-2.5 rounded-xl bg-zinc-800/80 px-3 py-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✂️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{shop.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[9px] text-zinc-400">{shop.rating} · {shop.dist}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-green-400" />
                <span className="text-[9px] text-green-400 font-medium">{shop.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Book button */}
        <div className="px-3 mt-3">
          <div className="w-full rounded-xl bg-amber-500 py-2.5 text-center text-[11px] font-bold text-white">
            Book Now — Instant Confirmation
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                </span>
                Now live in your city
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl font-bold leading-[1.05] lg:text-6xl xl:text-7xl"
            >
              Find & Book{" "}
              <span className="gradient-text">Nearby Barbers</span>{" "}
              in Seconds
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              See available barbers live on a map — just like Uber. Pick your
              barber, check real-time availability, and book your spot in two
              taps. No calls. No waiting.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#download"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold",
                  "bg-amber-500 text-white hover:bg-amber-600",
                  "transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
                )}
              >
                Download Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/for-shops"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold",
                  "border border-border bg-background text-foreground",
                  "transition-all duration-200 hover:bg-accent hover:-translate-y-0.5"
                )}
              >
                I Own a Shop
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              {[
                { icon: Shield, text: "No-show protection" },
                { icon: Star, text: "4.9 App Store rating" },
                { icon: Clock, text: "Instant confirmation" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-amber-500" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-border pt-10"
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <p className="text-3xl font-bold gradient-text">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
