import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    resolveAlias: {
      "@/lib/utils": path.resolve(__dirname, "../../packages/ui/src/lib/utils"),
      "@/components": path.resolve(__dirname, "../../packages/ui/src/components"),
    },
  },
};

export default nextConfig;
