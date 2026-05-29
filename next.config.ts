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
