import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: '/Mental-health-support-chatbot-with-face-Detection-',
  basePath: '/Mental-health-support-chatbot-with-face-Detection-',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
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
