const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,  // Enable the app directory
  },
};

module.exports = nextConfig;
