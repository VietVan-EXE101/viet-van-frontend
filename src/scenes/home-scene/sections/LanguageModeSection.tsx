/**
 * src/scenes/home-scene/sections/LanguageModeSection.tsx
 *
 * Section "Words come alive on stage" — 2 cột: text trái, ảnh phải.
 * Đã tích hợp hiệu ứng trượt từ TRÁI sang PHẢI chạy trực tiếp THEO CHUỘT khi cuộn.
 */
"use client"; // Bắt buộc phải có để sử dụng các React Hook và Framer Motion

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import languageImg from "@/assets/images/language-stage.png";

interface LanguageModeSectionProps {
  imageSrc?: string;
}

export function LanguageModeSection({ imageSrc }: LanguageModeSectionProps) {
  // Tạo một ref để tính toán mốc tọa độ cuộn của riêng Section này
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Lắng nghe tiến trình cuộn chuột khi cấu phần này bắt đầu đi vào khung hình
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // 2. ĐIỀU CHỈNH TỐC ĐỘ VÀ HƯỚNG TẠI ĐÂY:
  // - Cho trượt từ TRÁI sang phải để tạo nhịp xen kẽ với Cinematic Section (ở trên đi từ phải qua).
  // - Đồng bộ mốc [0, 0.5, 1] để hình đẩy ra nhanh và khớp vị trí sớm y hệt các section trước.
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-50vw", "0vw", "0vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-16 py-16 md:py-24 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* ── BỌC TOÀN BỘ KHỐI NỘI DUNG TRONG motion.div THEO TIẾN TRÌNH CUỘN CHUỘT ── */}
      <motion.div style={{ x, opacity }} className="w-full">

        {/* MỞ RỘNG LAYOUT: Giữ nguyên cấu trúc lưới của bạn */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* ── Text (trái) ── */}
          <div className="flex flex-col gap-6 text-left md:order-first order-last">
              
            {/* ICON CUỐN SÁCH */}
            <div className="w-full flex items-center justify-start text-white">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 4h-7a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            {/* TIÊU ĐỀ */}
            <h2
              className="font-body text-white text-3xl md:text-[40px] font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-geist-sans, system-ui)" }}
            >
              Language mode
            </h2>

            {/* ĐOẠN VĂN MÔ TẢ */}
            <p
              className="font-light text-sm md:text-[15px] leading-relaxed w-full"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              Each performance teaches. The vocabulary appears when you need it,
              dissolving back into shadow when the moment passes. Education without 
              interruption.
            </p>

            {/* KHỐI CTA BUTTONS CHUẨN FIGMA */}
            <div className="flex items-center gap-4 mt-2">
              {/* Nút Explore */}
              <Link
                href="#"
                className="border border-white/80 
                text-white 
                px-6 py-2.5 text-sm 
                font-light 
                tracking-wide 
                transition-colors 
                duration-200 
                hover:bg-white hover:text-black rounded-none bg-transparent"
              >
                Explore
              </Link>
              
              {/* Nút Watch */}
              <Link
                href="#"
                className="flex items-center gap-2 text-sm font-light w-fit transition-colors duration-200 text-white hover:text-white"
              >
                <span>Watch</span>
                <svg 
                  width="10" 
                  height="10" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                  className="inline-block"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Ảnh (phải) ── */}
          <div
            className="relative w-full rounded-none overflow-hidden border border-white/5 order-first md:order-last"
            style={{ aspectRatio: "1 / 1" }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Language mode — top-down stage view"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#050505]">
                <Image
                  src={languageImg}
                  alt="Stage"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
}