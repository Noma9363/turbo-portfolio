import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.sennheiser.com" },
    ],
  },
};

export default nextConfig;
