/** @type {import('next').NextConfig} */
export const nextConfig = {
  /* config options here */
  distDir: '.next',
  // sourceディレクトリをルートとして設定
  experimental: {
    appDir: true
  }
};
