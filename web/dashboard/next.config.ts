import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  experimental: {
    useCache: true,
  },
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
