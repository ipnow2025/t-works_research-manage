/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/research_manage",
  assetPrefix: "/research_manage",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
