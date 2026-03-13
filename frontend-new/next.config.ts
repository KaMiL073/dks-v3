import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Produkcja (frontend)
      {
        protocol: "https",
        hostname: "www.dks.pl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dks.pl",
        pathname: "/**",
      },

      // Publiczny backend (IP) – assets z prefiksem /backend
      {
        protocol: "http",
        hostname: "188.252.84.172",
        pathname: "/backend/assets/**",
      },

      // Lokalne środowisko backendu Directus (LAN)
      {
        protocol: "http",
        hostname: "192.168.1.83",
        pathname: "/backend/assets/**",
      },

      // Proxy po localhost (częsty przypadek w dev): /backend/assets/<uuid>
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/backend/assets/**",
      },

      // Directus w docker / lokalnie – standardowe /assets/<uuid>
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

      // Dodatkowe lokalne warianty (często wychodzą z różnych env/URL builderów)
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "8055",
        pathname: "/assets/**",
      },

      // Zewnętrzne placeholdery
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],

    formats: ["image/avif", "image/webp"],

    // Jak dalej będą jaja w dev (np. przez nagłówki/proxy), odkomentuj:
    // unoptimized: process.env.NODE_ENV === "development",
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;