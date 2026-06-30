"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale"; // Thêm các hướng chuyển động
  delay?: number;
}

export function ScrollReveal({ children, direction = "up", delay = 0 }: ScrollRevealProps) {
  // Định nghĩa tọa độ ban đầu dựa trên hướng truyền vào
  const getVariants = () => {
    switch (direction) {
      case "left":
        return { hidden: { opacity: 0, x: -40, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } };
      case "right":
        return { hidden: { opacity: 0, x: 40, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } };
      case "scale":
        return { hidden: { opacity: 0, scale: 1.05, y: 0 }, visible: { opacity: 1, scale: 1, y: 0 } };
      case "up":
      default:
        return { hidden: { opacity: 0, y: 35, x: 0 }, visible: { opacity: 1, y: 0, x: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} // Kích hoạt khi phần tử vào khung hình 100px
      variants={getVariants()}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.215, 0.61, 0.355, 1], // Hiệu ứng cubic-bezier làm mượt chuyển động ở điểm cuối
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}