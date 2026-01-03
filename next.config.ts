import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/BallXPitWebHelper',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
