"use client";
import { useState, useEffect } from "react";
import { WaterLogoIntro } from "../intro-scene/WaterLogoIntro";
import { INTRO_STORAGE_KEY } from "../intro-scene/intro.config";

export function HomePage() {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Đẩy việc đặt trạng thái sang hàng đợi macro-task để tránh Cascading Render đồng bộ
    const timer = setTimeout(() => {
      const seen = sessionStorage.getItem(INTRO_STORAGE_KEY);
      setShowIntro(!seen);
      setMounted(true);
    }, 0);

    // Dọn dẹp timer nếu component bị unmount bất ngờ
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Tránh hiện tượng nháy giao diện (flash) trước khi khớp Hydration giữa Client và Server
    return (
      <div className="min-h-screen" style={{ background: "#030810" }} />
    );
  }

  return (
    <>
      {showIntro && (
        <WaterLogoIntro onComplete={() => setShowIntro(false)} />
      )}
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#030810] text-zinc-100 px-6">
        <h1 className="text-2xl sm:text-3xl font-light tracking-widest text-center opacity-80">
          Sân khấu kịch số
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-500 text-center max-w-md leading-relaxed">
          Nền tảng kể chuyện AI — lấy cảm hứng từ rối nước, văn học và truyện dân gian Việt Nam.
        </p>
      </main>
    </>
  );
}