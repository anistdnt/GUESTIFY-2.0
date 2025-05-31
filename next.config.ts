import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
