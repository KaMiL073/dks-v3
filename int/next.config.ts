import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/int",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "directus", port: "8055", pathname: "/assets/**" },
      { protocol: "http", hostname: "localhost", port: "8055", pathname: "/assets/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "dks.pl", pathname: "/**" },
      { protocol: "https", hostname: "www.dks.pl", pathname: "/**" },
    ],
  },
  // (opcjonalnie) włącz typedRoutes jak ostrzega log:
  typedRoutes: true,
};

export default nextConfig;