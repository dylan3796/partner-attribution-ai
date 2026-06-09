import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Trace files from the monorepo root so serverless functions include code from
  // packages/, convex/ and engine/ (the build runs with cwd = this app dir).
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  // Source-only internal workspace package consumed by name (e.g. app/setup).
  transpilePackages: ["@covant/engine"],
  async redirects() {
    // The product app has no marketing home; send the host root (and the shared
    // nav logo, which links to "/") to the dashboard.
    return [{ source: "/", destination: "/dashboard", permanent: false }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
