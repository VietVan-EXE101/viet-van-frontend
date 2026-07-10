/**
 * src/components/layout/Navbar.tsx
 *
 * Thanh điều hướng sticky — Đã sửa lỗi không thể click lần 2 bằng cách sử dụng
 * thẻ <a> thuần cho anchor link nội bộ, tránh xung đột Router State của Next.js.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import picLogo from "@/assets/logos/pic_logo.png";

const NAV_LINKS = [
  { label: "Explore", href: "/#explore" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/#join" },
] as const;

export function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);

  // Hàm xử lý ép cuộn mượt hoạt động độc lập và ổn định trên mọi lượt click
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      
      if (element) {
        e.preventDefault(); // Ngăn chặn hành vi nhảy trang mặc định
        
        // Cuộn mượt đến phần tử đích
        element.scrollIntoView({ behavior: "smooth" });
        
        // Cập nhật thanh URL mà không làm mất trạng thái cuộn
        window.history.pushState(null, "", "/home");
      }
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-12 h-20 bg-black/50 backdrop-blur-md"
      style={{ borderBottom: "none" }}
    >
      <div className="flex items-center gap-10">  
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image
            src={picLogo}
            alt="Việt Văn"
            width={30}
            height={30}
            className="object-contain"
          />
          

        </Link>

        {/* Thanh Điều Hướng (Sử dụng thẻ <a> để sửa lỗi click lần 2) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-white hover:text-white text-sm font-light tracking-wide transition-colors duration-200 cursor-pointer"
            >
              {item.label}
            </a>
          ))}

          {/* Cụm More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-normal tracking-wide transition-colors"
            >
              <span>More</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {moreOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-36 rounded-none overflow-hidden"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {["Blog", "Changelog", "Community"].map((item) => (
                  <a
                    key={item}
                    href={`/#${item.toLowerCase()}`}
                    onClick={(e) => {
                      setMoreOpen(false);
                      handleScroll(e, `/#${item.toLowerCase()}`);
                    }}
                    className="block px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Cụm Bên Phải (Giữ nguyên Link vì là tuyến đường trang khác) */}
      <div className="flex items-center gap-4">
        <Link
          href="/signin"
          className="border border-white text-white px-5 py-2 text-sm tracking-wide transition-colors duration-200 hover:bg-white/10 rounded-none"
        >
          Sign in
        </Link>
        <a
          href="#join"
          onClick={(e) => handleScroll(e, "#join")}
          className="bg-white text-black px-5 py-2 text-sm tracking-wide font-medium transition-colors duration-200 hover:bg-white/90 rounded-none cursor-pointer"
        >
          Join
        </a>
      </div>
    </header>
  );
}