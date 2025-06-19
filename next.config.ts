import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Webpack to create an alias for 'src'
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        "@": path.resolve(__dirname, "src"), // Alias '@' to point to 'src' folder
      },
    };
    return config;
  },

  // Image domain configuration for next/image
  images: {
    domains: ["127.0.0.1", "localhost", "54.253.189.135", "3.104.29.16", "www.sarynthelabel.my.id", "sarynthelabel.my.id", "admin.sarynthelabel.my.id"] // 
  },

  // Rewrites to proxy API requests to the Laravel backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://www.sarynthelabel.my.id/api/:path*", // Proxy to Laravel backend
      },
    ];
  },

  // Add additional configurations as needed
  reactStrictMode: true, // Optional: Enable React Strict Mode
};

export default nextConfig;
