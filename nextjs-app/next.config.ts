import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    dangerouslyAllowSVG: true,
    formats: ["image/webp", "image/avif"], // ✅ serve modern formats for better performance
  },

  compress: true, // ✅ enables gzip/brotli compression for all responses

  env: {
    SC_DISABLE_SPEEDY: "false",
  },

  experimental: {
    largePageDataBytes: 256 * 1000, // 256 KB
  },

  // ✅ Cache optimization for static assets
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|woff2)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  reactStrictMode: true,
  //swcMinify: true,
};

module.exports = withNextIntl(nextConfig);
