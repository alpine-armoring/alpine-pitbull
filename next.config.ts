import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  images: {
    contentDispositionType: 'inline',
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [375, 640, 768, 1024, 1280, 1920, 2200],
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
        hostname: 'https://alpinetesting.cloudflex-ha.com',
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
        hostname: 'bugatti.imgix.net',
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
    ],
  },
};

export default nextConfig;
