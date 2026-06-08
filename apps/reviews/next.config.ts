import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
