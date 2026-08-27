import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 默认使用 Turbopack，显式声明以兼容下面那段旧 webpack 配置。
  // 删掉这一行 `npm run build` 会直接失败（Turbopack 拒绝在有 webpack 配置时静默运行）。
  turbopack: {},
  experimental: {
    // 根布局是顶层动态段 app/[lng]/layout.tsx，URL 没匹配上时 Next 拿不到 lng，
    // 普通的 not-found.tsx 渲染不出来。开这个才能用 app/global-not-found.tsx。
    globalNotFound: true,
  },
  images: {
    // 默认的 deviceSizes 最大到 3840，但本站的配图原图最宽 1600 ——
    // 请求比原图更大的尺寸只会把图拉伸放大，白白多下载字节。
    // 按实际内容收窄档位：手机 → 平板 → 桌面 → 2x 屏。
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    // 优先 AVIF，回退 WebP。同画质下 AVIF 通常比 WebP 再小 20% 左右
    formats: ['image/avif', 'image/webp'],
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
