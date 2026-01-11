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
  // Skip static generation for API routes (they're always dynamic)
  staticPageGenerationTimeout: 120,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000 * 60,
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig
