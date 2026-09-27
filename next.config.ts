import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/links",
        destination: "/dog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
