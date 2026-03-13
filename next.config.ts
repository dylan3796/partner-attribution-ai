import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/roi",
        destination: "/tools",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
