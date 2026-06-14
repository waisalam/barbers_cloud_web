import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | BarbersCloud",
    default: "BarbersCloud — Book Nearby Barbers Instantly",
  },
  description:
    "Find and book nearby barbers in seconds. See them live on a map, like Uber — for your next great cut.",
  keywords: ["barber", "booking", "haircut", "appointment", "barbershop"],
  openGraph: {
    title: "BarbersCloud",
    description: "Find and book nearby barbers in seconds.",
    type: "website",
  },
};

// Runs before React hydration — applies stored theme class to <html> instantly,
// preventing flash of unstyled content. Lives in <head>, not inside a React
// component body, so React 19 never warns about it.
const themeScript = `(function(){try{var t=localStorage.getItem('barberscloud-theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
