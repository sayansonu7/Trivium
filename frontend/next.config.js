/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configure for Netlify deployment
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Optimize build performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }
    return config;
  },
  // Reduce memory usage during build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
