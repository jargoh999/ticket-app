/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["geist"],

  // Image optimization configuration
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  output: 'export', 
  // Disable eslint during build
  eslint: {
    ignoreDuringBuilds: true,
  },



  // Optional: Add headers for security and performance
  
};

export default config;
