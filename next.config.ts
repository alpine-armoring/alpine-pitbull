import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep only your working SASS configuration
  sassOptions: {
    logger: {
      warn: (message) => {
        if (message.includes('Deprecation') || message.includes('deprecat')) {
          return;
        }
      },
    },
    quietDeps: true,
    prependData: `@use './styles/_mixins.scss' as *;`,
  },

  experimental: {
    optimizePackageImports: ['gsap', 'lenis'],
  },

  webpack: (config) => {
    // Ignore canvas module for PDF.js (only needed for server-side Node.js rendering)
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        gsap: {
          name: 'gsap',
          test: /[\\/]node_modules[\\/](gsap)[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        lenis: {
          name: 'lenis',
          test: /[\\/]node_modules[\\/](lenis)[\\/]/,
          priority: 20,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },

  // Keep your working image configuration
  images: {
    contentDispositionType: 'inline',
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [375, 640, 768, 1024, 1280, 1920, 2200],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'alpinetesting.cloudflex-ha.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'alpineco.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.alpineco.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd102sycao8uwt8.cloudfront.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-waw2-1.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-waw2-2.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-bru2-1.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-fra3-1.cdninstagram.com',
        pathname: '**',
      },
    ],
  },

  // Only add safe, basic optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
