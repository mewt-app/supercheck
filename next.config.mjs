/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['dribbble.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
