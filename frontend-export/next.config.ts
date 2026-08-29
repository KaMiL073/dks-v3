import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "",
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, ".."),
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "dks.pl", pathname: "/backend/assets/**" },
      { protocol: "https", hostname: "www.dks.pl", pathname: "/backend/assets/**" },
      { protocol: "http", hostname: "directus", port: "8055", pathname: "/assets/**" },
    ],
  },
};

export default nextConfig;
