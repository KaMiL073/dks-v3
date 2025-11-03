import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.dks.pl",
        port: "", // 🔹 musimy jawnie podać pusty port dla https
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dks.pl",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "directus",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "", // 🔹 wymagane przy Next.js 14+
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], // 🔹 lepsza optymalizacja
  },
  // (opcjonalnie) pozwala ładować obrazy z dowolnych domen przy dev/test
  // experimental: { images: { allowFutureImage: true } },
};

export default nextConfig;