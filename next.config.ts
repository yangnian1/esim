import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 第三方图片资源
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
