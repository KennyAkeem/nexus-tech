/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/nexus-tech" : "",
  assetPrefix: isProd ? "/nexus-tech/" : "",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

 