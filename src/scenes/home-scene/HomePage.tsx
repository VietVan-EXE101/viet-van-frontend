/**
 * src/scenes/home-scene/HomePage.tsx
 *
 * Orchestrator chính — quản lý:
 * 1. Trạng thái intro (đã xem chưa, qua sessionStorage)
 * 2. Fade-in mượt của nội dung sau khi intro kết thúc
 * 3. Tập hợp tất cả sections + Navbar + Footer
 */
"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { WaterLogoIntro } from "@/scenes/intro-scene/WaterLogoIntro";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "./sections/HeroSection";
import { StageSection } from "./sections/StageSection";
import { CinematicModeSection } from "./sections/CinematicModeSection";
import { LanguageModeSection } from "./sections/LanguageModeSection";
import { JoinSection } from "./sections/JoinSection";
import { INTRO_STORAGE_KEY } from "@/scenes/intro-scene/intro.config";

gsap.registerPlugin(useGSAP);

// ── Trạng thái ────────────────────────────────────────────────────────────────
type PageState = "loading" | "intro" | "home";

export function HomePage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const mainRef = useRef<HTMLDivElement>(null);

  // Kiểm tra sessionStorage sau khi hydration (tránh SSR mismatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      const seen = sessionStorage.getItem(INTRO_STORAGE_KEY);
      setPageState(seen ? "home" : "intro");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Chỉ kích hoạt cuộn khi trạng thái trang chủ đã tải xong toàn bộ DOM
    if (pageState === "home") {
      const hash = window.location.hash; // Lấy ra cái #explore từ URL
      if (hash) {
        // Dùng setTimeout 100ms để đảm bảo React và GSAP đã dựng xong các chiều cao của component
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", "/home");
          }
        }, 100);
      }
    }
  }, [pageState]);

  // Fade-in nội dung khi chuyển sang "home"
  useGSAP(
    () => {
      if (pageState === "home" && mainRef.current) {
        gsap.fromTo(
          mainRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
            delay: 0.1,
          }
        );
      }
    },
    { dependencies: [pageState] }
  );

  const handleIntroComplete = () => {
    setPageState("home");
  };

  // ── Loading state (hydration chưa xong) ──────────────────────────────────
  if (pageState === "loading") {
    return (
      <div
        className="fixed inset-0"
        aria-hidden
      />
    );
  }

  return (
    <>
      {/* Intro overlay (fixed, z-50 — che toàn màn hình) */}
      {pageState === "intro" && (
        <WaterLogoIntro onComplete={handleIntroComplete} />
      )}

      {/* Nội dung chính (render ngay, opacity 0 khi intro đang chạy) */}
      <div
        ref={mainRef}
        style={{
          opacity: pageState === "intro" ? 0 : 1,
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main>
          <HeroSection />

          {/*
           * 💡 HƯỚNG DẪN THAY ẢNH:
           *
           * StageSection — ảnh anime Vietnamese alley (B&W/desaturated), tỷ lệ 16:7
           *   import stageImg from "@/assets/images/stage-alley.jpg";
           *   <StageSection imageSrc={stageImg.src} />
           *
           * CinematicModeSection — ảnh anime room interior (green tones), tỷ lệ 1:1
           *   import cinematicImg from "@/assets/images/cinematic-room.jpg";
           *   <CinematicModeSection imageSrc={cinematicImg.src} />
           *
           * LanguageModeSection — ảnh top-down stage view (yellow-green), tỷ lệ 1:1
           *   import languageImg from "@/assets/images/language-stage.jpg";
           *   <LanguageModeSection imageSrc={languageImg.src} />
           */}
          <StageSection />
          <CinematicModeSection />
          <LanguageModeSection />
          <JoinSection />
        </main>

        <Footer />
      </div>
    </>
  );
}