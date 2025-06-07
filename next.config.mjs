/* eslint-disable import/no-default-export */
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  // Docker環境での最適化
  experimental: {
    // Turbopackの有効化（Next.js 15対応）
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // 開発時のファイル監視設定
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
