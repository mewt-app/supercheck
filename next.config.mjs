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
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
