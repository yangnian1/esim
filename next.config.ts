import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 第三方图片资源
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // 常见的图片托管服务
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    // 对于未配置的域名，使用 unoptimized 模式（会失去优化，但可以显示图片）
    // 或者我们可以在组件中处理
  },
  // 修复 webpack 配置，确保 Supabase 模块正确解析
  webpack: (config, { isServer }) => {
    // 确保 Supabase 在客户端和服务端都能正确打包
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // 确保 @supabase/supabase-js 被正确解析
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // 优化模块解析
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    return config;
  },
  // 服务器组件外部包配置
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
