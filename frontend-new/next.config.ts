import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Jeœli u¿ywasz TYLKO "/backend/assets/..." + unoptimized
    // to ta sekcja mo¿e byæ nawet pusta, ale nie szkodzi:
    remotePatterns: [
      { protocol: "https", hostname: "dks.pl", pathname: "/backend/assets/**" },
      { protocol: "https", hostname: "dks.pl", pathname: "/static/**" },
    ],
  },
};

export default nextConfig;
