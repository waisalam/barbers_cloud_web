"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-shops", label: "For Shop Owners" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white transition-transform duration-200 group-hover:scale-110">
              <Scissors className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Barbers<span className="text-amber-500">Cloud</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:flex" />
            <Link
              href="/#download"
              className={cn(
                "hidden lg:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
                "bg-amber-500 text-white hover:bg-amber-600",
                "transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
              )}
            >
              Get the App
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-md lg:hidden text-foreground hover:bg-accent transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-amber-500/10 text-amber-500"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                <Link
                  href="/#download"
                  className="flex-1 text-center rounded-full px-4 py-2.5 text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Get the App
                </Link>
                <ThemeToggle className="ml-3" />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
