import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    useCache: true,
  },
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
