/**
 * src/scenes/home-scene/sections/CinematicModeSection.tsx
 *
 * Section "Cinematic mode" — 2 cột: ảnh trái, text phải.
 * Đã tích hợp hiệu ứng trượt từ PHẢI sang TRÁI chạy trực tiếp THEO CHUỘT khi cuộn.
 */
"use client"; // Bắt buộc phải có để sử dụng các React Hook và Framer Motion

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import cinematicImg from "@/assets/images/cinematic-room.png";

interface CinematicModeSectionProps {
  imageSrc?: string;
}

export function CinematicModeSection({ imageSrc }: CinematicModeSectionProps) {
  // Tạo một ref để tính toán mốc tọa độ cuộn của riêng Section này
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Lắng nghe tiến trình cuộn chuột khi cấu phần này bắt đầu đi vào khung hình
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // 2. ĐIỀU CHỈNH TỐC ĐỘ VÀ HƯỚNG TẠI ĐÂY:
  // - Vì cinematic đi từ bên PHẢI vào nên ta đổi thành số dương ("50vw" về "0vw").
  // - Giữ nguyên mốc [0, 0.5, 1] giống StageSection để hình đẩy ra nhanh và khớp vị trí sớm hơn.
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["50vw", "0vw", "0vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="explore"
      /* 🔥 ĐÃ SỬA THÊM: 
        - `scroll-mt-20`: Đẩy mốc dừng chân xuống 80px để không bị che dưới Navbar h-20.
        - `overflow-hidden`: Giữ khối "50vw" không bị tràn ra rìa phải màn hình làm lỗi tọa độ anchor link.
      */
      className="min-h-screen bg-black flex items-center relative overflow-hidden py-20"
    >
      {/* ── BỌC TOÀN BỘ KHỐI NỘI DUNG TRONG motion.div THEO TIẾN TRÌNH CUỘN CHUỘT ── */}
      <motion.div style={{ x, opacity }} className="w-full">
        
        {/* MỞ RỘNG LAYOUT: Giữ nguyên cấu trúc grid 2 cột của bạn */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* ── Ảnh (trái) ── */}
          <div
            className="relative w-full rounded-none overflow-hidden border border-white/5"
            style={{ aspectRatio: "1 / 1" }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Cinematic mode — Vietnamese theater room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#050505]">
                <Image
                  src={cinematicImg}
                  alt="Cinematic room"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* ── Text (phải) ── */}
          <div className="flex flex-col gap-6 text-left">

            {/* ICON MÁY QUAY */}
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
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                <polygon points="16,12 22,7 22,17" fill="currentColor"/>
              </svg>
            </div>

            {/* TIÊU ĐỀ */}
            <h2
              className="font-body text-white text-3xl md:text-[40px] font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-geist-sans, system-ui)" }}
            >
              Cinematic mode
            </h2>

            {/* ĐOẠN VĂN MÔ TẢ */}
            <p
              className="font-light text-sm md:text-[15px] leading-relaxed w-full "
              style={{ color: "rgb(255, 255, 255)" }}
            >
              A theatrical stage designed with a Parallax effect. The space features a
              distinctively ancient Vietnamese aesthetic, illustrated in combination with a 
              Dark Mode theme.
            </p>

            {/* NÚT PLAY */}
            
            <Link
              href="/library"
              className="flex items-center gap-2 text-sm font-light w-fit transition-colors duration-200 mt-2 text-white hover:text-white"
            >
              <span>Play</span>
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
      </motion.div>
    </section>
  );
}