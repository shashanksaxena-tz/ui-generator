/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@generative-ui/ui',
    '@generative-ui/themes',
    '@generative-ui/types',
    '@generative-ui/agents',
    '@generative-ui/mcp',
  ],
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  // Support for src directory
  distDir: '.next',
};

module.exports = nextConfig;
