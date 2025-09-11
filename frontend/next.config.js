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
};

module.exports = nextConfig;
