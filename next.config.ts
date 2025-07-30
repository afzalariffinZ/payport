import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config) => {
    // This is the crucial part that prevents the error
    // It forces Webpack to handle Tesseract's core in a way that works
    // in serverless environments.
    config.externals.push({
      'tesseract.js-core': 'tesseract.js-core',
    });

    return config;
  },
};

export default nextConfig;
