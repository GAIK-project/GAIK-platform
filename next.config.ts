import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
