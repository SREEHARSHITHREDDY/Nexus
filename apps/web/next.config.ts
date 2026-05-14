import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode:  true,
  poweredByHeader:  false,
  transpilePackages: [
    '@nexus/ui',
    '@nexus/api-client',
    '@nexus/types',
    '@nexus/utils',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
    ],
  },
};

export default config;