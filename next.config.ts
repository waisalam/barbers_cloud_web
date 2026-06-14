import type { NextConfig } from "next";

const marketingHeaders = [
  { key: "X-DNS-Prefetch-Control",    value: "on"                                   },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN"                            },
  { key: "X-Content-Type-Options",    value: "nosniff"                               },
  { key: "Referrer-Policy",           value: "origin-when-cross-origin"              },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const adminHeaders = [
  ...marketingHeaders.filter((h) => h.key !== "X-Frame-Options"),
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cache-Control",   value: "no-store" },
];

const nextConfig: NextConfig = {
 
  async headers() {
    return [
      { source: "/admin/(.*)", headers: adminHeaders     },
      { source: "/(.*)",       headers: marketingHeaders },
    ];
  },
  experimental: {},
};

export default nextConfig;