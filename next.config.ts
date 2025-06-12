import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Mental-health-support-chatbot-with-face-Detection-',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false
      };
    }
    return config;
  },
};

export default nextConfig;
