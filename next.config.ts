import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/home",      // Khi URL hiển thị là /home
        destination: "/",     // Next.js sẽ âm thầm chạy file src/app/page.tsx
      },
    ];
  },
};

export default nextConfig;