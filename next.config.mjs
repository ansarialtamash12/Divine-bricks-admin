/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.zaddycare.in',
      },
      {
        protocol: 'https',
        hostname: 'agentondemand.ai',
        pathname: '/CategoryImage/**',
      },
      // 👇 Yeh naya block add kiya gaya hai
      {
        protocol: 'https',
        hostname: 'apis.divinebricks.com',
        pathname: '/CategoryImage/**', 
      },
    ],
  },
};

export default nextConfig;