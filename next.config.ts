import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "air-front-black.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yhdlmhskgwjnlimjjccl.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
