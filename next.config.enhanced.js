// next.config.js - Updated with bundle analyzer

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Existing image configuration
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.builder.io' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.builder.io' },
    ],
  },

  // Optional: Enable bundle analyzer
  // To use: npm run analyze
  webpack: (config, options) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          enabled: process.env.ANALYZE === 'true',
          openAnalyzer: false,
        })
      )
    }
    return config
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },

  // Redirect http to https in production
  async redirects() {
    return []
  },

  // Rewrite rules
  async rewrites() {
    return {
      beforeFiles: [
        // API rewrites here if needed
      ],
    }
  },
}

module.exports = nextConfig
