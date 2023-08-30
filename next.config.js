/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*','randomuser.me','images.unsplash.com'], // Add your domain(s) here
  },
}

module.exports = nextConfig
