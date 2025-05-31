import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Disable TypeScript type-checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint checks during build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'guestify-2-0-backend.onrender.com',
        pathname: '/user-assets/**',
      },
    ],
  },
};

export default nextConfig;
