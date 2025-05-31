import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  experimental: {
    useCache: true,
  }, // We only have the shared folder, with utils and types
  transpilePackages: [
    "@gaik/shared-utils", // Utility functions for GAIK
    "@gaik/shared-types", // TypeScript types for GAIK
    "@gaik/shared-components", // Reusable React components for GAIK
  ],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
