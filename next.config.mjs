/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the production build to finish even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This skips linting checks during build to speed things up
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
