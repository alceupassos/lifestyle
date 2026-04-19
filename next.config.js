/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.fashn.ai',
      },
      {
        protocol: 'https',
        hostname: '**.fashn.ai',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'supliutech.nyc3.cdn.digitaloceanspaces.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

module.exports = nextConfig;
