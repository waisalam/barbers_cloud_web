"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { MapPin, CalendarCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import keeps the 3D bundle out of SSR
const PhoneCanvas = dynamic(() => import("@/components/3d/phone-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
    </div>
  ),
});

// ─── Step data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    Icon: MapPin,
    color: "text-blue-400",
    iconBg: "bg-blue-500/10",
    accent: "#3b82f6",
    title: "See who's available — live",
    body: "Open BarbersCloud and a live map shows every barber near you. Real positions, current wait times, instant availability. Like Uber, for haircuts.",
    tag: "Nearby now",
  },
  {
    num: "02",
    Icon: CalendarCheck,
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
    accent: "#f59e0b",
    title: "Pick your barber & book in two taps",
    body: "Browse profiles, services, and pricing. Select your slot, tap confirm — you're booked instantly. No calls, no guessing, no waiting to hear back.",
    tag: "Instant confirmation",
  },
  {
    num: "03",
    Icon: CheckCircle2,
    color: "text-green-400",
    iconBg: "bg-green-500/10",
    accent: "#22c55e",
    title: "Walk in. Look great.",
    body: "Your chair is waiting. We send reminders 24h and 1h before so you never miss. Show up on time and walk out looking exactly how you wanted.",
    tag: "Zero no-shows",
  },
];

// ─── Individual step panel ────────────────────────────────────────────────────

interface StepPanelProps {
  step: typeof STEPS[number];
  opacityFrom: number;
  opacityPeakStart: number;
  opacityPeakEnd: number;
  opacityTo: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function StepPanel({
  step,
  opacityFrom,
  opacityPeakStart,
  opacityPeakEnd,
  opacityTo,
  scrollYProgress,
}: StepPanelProps) {
  // hooks at top level — always called, never inside conditions
  const opacity = useTransform(
    scrollYProgress,
    [opacityFrom, opacityPeakStart, opacityPeakEnd, opacityTo],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [opacityFrom, opacityPeakStart, opacityPeakEnd, opacityTo],
    [28, 0, 0, -28]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Step {step.num}
      </span>
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl mb-5",
          step.iconBg
        )}
      >
        <step.Icon className={cn("h-6 w-6", step.color)} />
      </div>
      <h2 className="text-4xl font-bold text-foreground leading-tight lg:text-5xl">
        {step.title}
      </h2>
      <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-md">
        {step.body}
      </p>
      <div
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5"
        style={{
          borderColor: step.accent + "40",
          backgroundColor: step.accent + "10",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: step.accent }}
        />
        <span className="text-sm font-semibold" style={{ color: step.accent }}>
          {step.tag}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ activeScene }: { activeScene: number }) {
  return (
    <div className="flex flex-col gap-2">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-500",
            i === activeScene ? "h-8 w-2 bg-amber-500" : "h-2 w-2 bg-border"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main ScrollShowcase ──────────────────────────────────────────────────────

export function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [activeScene, setActiveScene] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const scene = v < 0.33 ? 0 : v < 0.66 ? 1 : 2;
    setActiveScene((prev) => (prev !== scene ? scene : prev));
  });

  // ALL useTransform calls at top level — never inside JSX or conditions
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Ambient glow color per scene
  const glowColor =
    activeScene === 0
      ? "#3b82f610"
      : activeScene === 1
      ? "#f59e0b10"
      : "#22c55e10";

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: isMobile ? "auto" : "300vh" }}
      aria-label="How BarbersCloud works"
    >
      <div
        className={cn(
          "w-full",
          isMobile
            ? "relative py-16"
            : "sticky top-0 h-screen overflow-hidden"
        )}
      >
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Progress bar — desktop only, but motion.div always rendered to avoid hook issues */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 bg-border z-10",
            isMobile ? "hidden" : "block"
          )}
        >
          <motion.div
            className="h-full bg-amber-500"
            style={{ width: progressBarWidth }}
          />
        </div>

        <div className="mx-auto max-w-7xl h-full px-6 lg:px-8">
          {isMobile ? (
            /* ── Mobile: stacked layout ─────────────────────────────── */
            <div>
              <div className="relative h-[460px] mb-12">
                <div className="absolute inset-0 rounded-3xl bg-zinc-950/60" />
                <div className="absolute inset-0">
                  <PhoneCanvas progressRef={progressRef} autoPlay />
                </div>
              </div>
              <div className="space-y-16">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex gap-5">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl mt-1",
                        step.iconBg
                      )}
                    >
                      <step.Icon className={cn("h-5 w-5", step.color)} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Step {step.num}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed text-sm">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── Desktop: side-by-side ───────────────────────────────── */
            <div className="grid grid-cols-2 gap-8 h-full items-center">
              {/* Left: Text panels */}
              <div className="relative h-full flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 hidden xl:flex">
                  <ProgressDots activeScene={activeScene} />
                </div>
                <div className="relative w-full h-64">
                  <StepPanel
                    step={STEPS[0]}
                    opacityFrom={0}
                    opacityPeakStart={0.06}
                    opacityPeakEnd={0.27}
                    opacityTo={0.36}
                    scrollYProgress={scrollYProgress}
                  />
                  <StepPanel
                    step={STEPS[1]}
                    opacityFrom={0.32}
                    opacityPeakStart={0.42}
                    opacityPeakEnd={0.6}
                    opacityTo={0.69}
                    scrollYProgress={scrollYProgress}
                  />
                  <StepPanel
                    step={STEPS[2]}
                    opacityFrom={0.65}
                    opacityPeakStart={0.75}
                    opacityPeakEnd={0.95}
                    opacityTo={1.0}
                    scrollYProgress={scrollYProgress}
                  />
                </div>
              </div>

              {/* Right: 3D Phone */}
              <div className="relative h-[90vh]">
                <div className="absolute inset-0 rounded-3xl bg-zinc-950/60" />
                <div
                  className="absolute inset-0 pointer-events-none transition-colors duration-700"
                  style={{
                    background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
                  }}
                />
                <div className="absolute inset-0">
                  <PhoneCanvas progressRef={progressRef} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll hint — always rendered but hidden on mobile to keep hooks stable */}
        <motion.div
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2",
            isMobile ? "hidden" : "flex"
          )}
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            Scroll to explore
          </span>
          <motion.div
            className="h-8 w-5 rounded-full border border-border flex items-start justify-center pt-1.5"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="h-1.5 w-1 rounded-full bg-amber-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}