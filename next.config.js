const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:4000/api/:path*",
        },
      ];
    },
    eslint: { ignoreDuringBuilds: true },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'src'),
      path.join(__dirname),
    ],
  },
};

module.exports = nextConfig;
