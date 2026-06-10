import type { NextConfig } from "next";

// The marketing surface is three pages plus the /demo environment.
// Highest-equity legacy slugs 301 to the closest page; everything
// else 404s by design. (/demo is a real route now — the Meridian demo.)
const toProduct = [
  "/platform",
  "/features",
  "/agents",
  "/integrations",
  "/compare",
  "/beta",
  "/roi",
  "/resources",
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
};

export default nextConfig;
