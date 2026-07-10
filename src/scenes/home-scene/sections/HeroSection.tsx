/**
 * src/scenes/home-scene/sections/HeroSection.tsx
 *
 * Phần Hero — heading lớn với khung góc trang trí điện ảnh,
 * 2 CTA: Begin (filled) + Explore (ghost text).
 */
"use client";

import Link from "next/link";

export function HeroSection() {
    // 🛠️ Thêm hàm xử lý cuộn mượt đồng bộ với Navbar vào đây
    const handleScrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const element = document.getElementById("explore");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/home");
      }
    };
    return (
      <section 
        className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4 pt-20">
        {/* Khối bọc text: Đã loại bỏ hoàn toàn class tạo viền góc màu xanh */}
        <div className="max-w-4xl mx-auto flex flex-col items-center dynamic-text-block">
          
          {/* 
            TIÊU ĐỀ CHÍNH: 
            - Thêm class `font-body` để chuyển từ chữ có chân sang không chân chuẩn Figma.
            - Điều chỉnh text-[56px] và leading-[1.15] để tỉ lệ xuống hàng vuông vắn hoàn hảo.
          */}
          <h1 className="font-body text-4xl md:text-[56px] font-bold tracking-tight text-white mb-6 leading-[1.15] max-w-3xl">
            Enter the stage, command <br /> your performance
          </h1>
  
          {/* ĐOẠN MÔ TẢ PHỤ: Chuyển sang text-white/80 sáng rõ hơn */}
          <p className="font-light text-sm md:text-[15px] text-white max-w-2xl mx-auto mb-10 leading-relaxed">
            A digital theater built for those who understand the weight of a single moment. 
            Manage your craft with precision.
          </p>
  
          {/* Khối nút bấm: Đổi thành 2 nút viền trắng vuông góc cạnh */}
          <div className="flex flex-row items-center justify-center gap-4">
            <Link
              href="/begin"
              className="border border-white/80 text-white px-8 py-2.5 text-sm font-normal tracking-wide transition-colors duration-200 hover:border-white rounded-none bg-transparent"
            >
              Begin
            </Link>
            {/* 🛠️ CHỈNH SỬA TẠI ĐÂY: Chuyển hoàn toàn Link thành thẻ <a> thuần */}
            <a
              href="#explore"
              onClick={handleScrollToExplore}
              className="border border-white/80 text-white px-8 py-2.5 text-sm font-normal tracking-wide transition-colors duration-200 hover:border-white rounded-none bg-transparent cursor-pointer"
            >
              Explore
            </a>
          </div>
  
        </div>
      </section>
    );
  }

// ── Component góc trang trí ───────────────────────────────────────────────────

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

function CornerBracket({ position }: { position: CornerPosition }) {
  const size = 18;
  const thickness = 2;
  const color = "#2d5be3";

  const styles: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    opacity: 0.75,
  };

  // Áp dụng viền đúng phía theo góc
  if (position === "top-left") {
    styles.top = 0;
    styles.left = 0;
    styles.borderTopWidth = thickness;
    styles.borderLeftWidth = thickness;
  } else if (position === "top-right") {
    styles.top = 0;
    styles.right = 0;
    styles.borderTopWidth = thickness;
    styles.borderRightWidth = thickness;
  } else if (position === "bottom-left") {
    styles.bottom = 0;
    styles.left = 0;
    styles.borderBottomWidth = thickness;
    styles.borderLeftWidth = thickness;
  } else {
    styles.bottom = 0;
    styles.right = 0;
    styles.borderBottomWidth = thickness;
    styles.borderRightWidth = thickness;
  }

  return <span aria-hidden style={styles} />;
}