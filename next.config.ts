import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/roi", destination: "/tools", permanent: true },
      { source: "/product", destination: "/platform", permanent: true },
      { source: "/sign-up", destination: "/beta", permanent: true },
      { source: "/sign-in", destination: "/", permanent: true },
      { source: "/setup", destination: "/dashboard?demo=true", permanent: true },
    ];
  },
};

export default nextConfig;
