/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://photos.app.goo.gl/66XreqyWMPj4a9Km7',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig;
