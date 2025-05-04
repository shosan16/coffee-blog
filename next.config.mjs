/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  distDir: '.next',
  // sourceディレクトリをルートとして設定
  experimental: {
    appDir: true
  }
};

export default nextConfig;