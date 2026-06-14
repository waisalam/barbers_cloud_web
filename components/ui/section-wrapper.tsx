"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stagger, fadeUp } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function SectionWrapper({ children, className, id, delay = 0 }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={stagger(0.1)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={cn("py-24 lg:py-32", className)}
    >
      {children}
    </motion.section>
  );
}

export function AnimateChild({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
