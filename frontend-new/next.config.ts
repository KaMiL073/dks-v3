import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ?? produkcja
      {
        protocol: "https",
        hostname: "www.dks.pl",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dks.pl",
        port: "",
        pathname: "/**",
      },

      // ?? lokalne œrodowisko backendu Directus
      {
        protocol: "http",
        hostname: "192.168.1.83",
        port: "",
        pathname: "/backend/assets/**", // uwzglêdniamy prefix /backend
      },
      {
        protocol: "http",
        hostname: "directus",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },

      // ??? zewnêtrzne placeholdery
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // ?? alternatywnie (w razie proxy) mo¿na wy³¹czyæ optymalizacjê:
    // unoptimized: process.env.NODE_ENV === "development",
  },
  // ? dodatkowo (opcjonalnie) dla stabilnoœci edytora wizualnego
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
