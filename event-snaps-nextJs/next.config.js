/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://photos.app.goo.gl/mh4QU6h66MYyrUpf7',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig;
