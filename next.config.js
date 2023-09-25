/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*','randomuser.me','images.unsplash.com','lh3.googleusercontent.com', "www.gravatar.com" ], // Add your domain(s) here
  },
}

module.exports = nextConfig
