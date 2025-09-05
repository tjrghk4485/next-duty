/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/status',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
