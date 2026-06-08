import type { NextConfig } from "next";

// The marketing surface is three pages: / , /product , /about.
// Highest-equity legacy slugs 301 to the closest of the three; everything
// else 404s by design.
const toProduct = [
  "/platform",
  "/features",
  "/agents",
  "/integrations",
  "/compare",
  "/demo",
  "/beta",
  "/roi",
  "/resources",
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...toProduct.map((source) => ({
        source,
        destination: "/product",
        permanent: true,
      })),
      { source: "/contact", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
