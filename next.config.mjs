/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'other-allowed-hostname.com',
      },
    ],
  },
  env: {
    SECRET: process.env.SECRET,
  },
};

export default nextConfig;
