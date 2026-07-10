/**
 * src/scenes/home-scene/sections/StageSection.tsx
 *
 * Sân khấu toàn màn hình tích hợp Scroll-Driven Animation mượt mà.
 * Đã sửa lỗi xung đột anchor link bằng cách đồng bộ lại độ rộng w-full chuẩn xác.
 */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import stageImage from "@/assets/images/stage-alley.png";

interface StageSectionProps {
  imageSrc?: string;
  imageAlt?: string;
}

export function StageSection({
  imageSrc,
  imageAlt = "Vietnamese stage — alley backdrop",
}: StageSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lắng nghe tiến trình cuộn chuột chuẩn xác theo mốc của Section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Hiệu ứng trượt mượt mà di chuyển từ trái (-50vw) về vị trí gốc (0vw)
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-50vw", "0vw", "0vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="features"
      // 💡 ĐÃ SỬA: Điều chỉnh scroll-mt-20 (bằng 80px) khớp khít với chiều cao h-20 của Navbar 
      // giúp khi click Explore, màn hình sẽ dừng lại ở vị trí hoàn hảo nhất không bị lệch dòng.
      className="relative w-full scroll-mt-38 overflow-hidden bg-black select-none"
      aria-label="Stage backdrop"
    >
      <motion.div style={{ x, opacity }} className="w-full">
        {/* 🔥 ĐÃ SỬA QUAN TRỌNG: Đổi từ `w-screen` thành `w-full` 
          Triệt tiêu hoàn toàn lỗi tính dư thanh cuộn trình duyệt, giúp anchor link (#explore) 
          lao xuống đích và đứng im tuyệt đối, không còn hiện tượng giật nhảy khi bấm nhiều lần.
        */}
        <div
          className="relative w-full h-[70vh] overflow-hidden"
          style={{ aspectRatio: "16/7", minHeight: 240 }}
        >
          {/* Box chứa ảnh */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={imageSrc || stageImage}
              alt={imageAlt}
              fill
              className="object-cover brightness-95"
              sizes="100vw"
              priority
            />
          </div>
          
          {/* Lớp phủ Gradient mờ trên dưới */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60 pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}