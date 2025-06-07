import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        port: '3000',
        hostname: `localhost`,
        pathname: '/api/image-proxy',
      },
    ],
    dangerouslyAllowSVG: true, 
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'src', 'app', 'styles'),
    ],
    prependData: `@use "vars" as *; @use "mixin" as *;`,
  },
};

export default nextConfig;
