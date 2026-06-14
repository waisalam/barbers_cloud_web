import Link from "next/link";
import { Scissors } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/for-shops", label: "For Shop Owners" },
    { href: "/pricing", label: "Pricing" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Scissors className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                Barbers<span className="text-amber-500">Cloud</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Find and book nearby barbers in seconds. Live on a map, like Uber
              — for your next great cut.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BarbersCloud. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Available on iOS & Android
          </p>
        </div>
      </div>
    </footer>
  );
}
