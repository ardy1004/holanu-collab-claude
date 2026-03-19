/** @type {import('next').NextConfig} */

// Workers URL — selalu gunakan URL absolut untuk proxy destination
const WORKERS_URL = 'https://holanu-api.holanu-api.workers.dev';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
  },

  /**
   * API Proxy Rewrites — mengatasi CORS di local development
   *
   * LOCAL DEV (.env.local: NEXT_PUBLIC_API_URL=""):
   *   Browser  → GET /api/upload (same-origin, no CORS)
   *   Next.js  → proxy → https://holanu-api.workers.dev/api/upload
   *   Workers  → return ImageKit signature
   *
   * PRODUCTION (Vercel env: NEXT_PUBLIC_API_URL="https://holanu-api.workers.dev"):
   *   Browser langsung hit Workers URL — proxy tidak dipakai
   *   (isLocal = false → return [])
   */
  async rewrites() {
    const isLocal = !process.env.VERCEL && !process.env.CF_PAGES;
    if (!isLocal) return [];

    return [
      {
        source:      '/api/:path*',
        destination: `${WORKERS_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
