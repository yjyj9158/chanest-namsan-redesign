import type { NextConfig } from "next";
import withPWAInit, {
  runtimeCaching as defaultCache,
} from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: false,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: ({ url }: { url: URL }) =>
          url.pathname.startsWith("/api/") ||
          url.hostname.endsWith("supabase.co"),
        handler: "NetworkOnly",
      },
      ...defaultCache,
    ],
  },
});

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

export default withPWA(nextConfig);
