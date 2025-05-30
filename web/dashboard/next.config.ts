import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  experimental: {
    useCache: true,
  },
  // We only have the shader folder, with utils and types
  transpilePackages: [
    '@gaik/shader-utils',   // Utility functions for shaders
    '@gaik/shader-types',   // TypeScript types for shaders
  ],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
