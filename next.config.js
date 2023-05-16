/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images : {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com']
  }
}
const WithPWA = require('next-pwa');
WithPWA({
  pwa: {
		dest: "public",
		register: true,
    disable: process.env.NODE_ENV === 'development',
		skipWaiting: true,
	}
});

module.exports = nextConfig
