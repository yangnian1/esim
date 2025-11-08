import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 本地开发环境
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // 生产服务器环境 - uploads路径
      {
        protocol: 'http',
        hostname: 'admin.esimconnects.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.esimconnects.com',
        pathname: '/uploads/**',
      },
      // 生产服务器环境 - 根路径（支持placeholder等静态文件）
      {
        protocol: 'http',
        hostname: 'admin.esimconnects.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.esimconnects.com',
        pathname: '/**',
      },
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
