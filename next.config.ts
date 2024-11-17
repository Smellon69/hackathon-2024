import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Catch all requests to /api/*
        destination: 'http://localhost:7331/api/:path*', // Redirect to your backend
      },
    ];
  },
};

export default nextConfig;
