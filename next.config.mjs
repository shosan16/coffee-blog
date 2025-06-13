/* eslint-disable import/no-default-export */
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドのバンドルからサーバー専用のライブラリを除外
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino': false,
        'pino-pretty': false,
      };
    }
    return config;
  },
  // サーバー専用の外部ライブラリを指定
  serverExternalPackages: ['pino', 'pino-pretty']
};

export default nextConfig;
