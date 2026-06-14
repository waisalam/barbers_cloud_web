"use client";

import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch: server renders "dark" (default), client reads localStorage.
  // Only render the icon after mount so both sides agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []); // runs once, no loop

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      disabled={!mounted}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border bg-background/60 backdrop-blur-sm",
        "text-foreground transition-all duration-300",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-0",
        className
      )}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
