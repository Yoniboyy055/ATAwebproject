/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  eslint: {
    // ESLint warnings won't block the build in production
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
