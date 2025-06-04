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
    domains: ["127.0.0.1", "localhost"], // Allow loading images from localhost or 127.0.0.1
  },

  // Rewrites to proxy API requests to the Laravel backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Proxy to Laravel backend
      },
    ];
  },

  // Add additional configurations as needed
  reactStrictMode: true, // Optional: Enable React Strict Mode
};

export default nextConfig;
