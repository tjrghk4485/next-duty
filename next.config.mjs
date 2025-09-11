const API_HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "http://15.165.219.140:8080";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_HOST}/:path*`,
      },
    ];
  },
};

export default nextConfig;
