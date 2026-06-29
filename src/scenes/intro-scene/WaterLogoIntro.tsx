"use client";
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  INTRO_TIMING,
  INTRO_EASING,
  INTRO_ATMOSPHERE,
  INTRO_STORAGE_KEY,
  INTRO_ROPE,
} from "./intro.config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// 💡 IMPORT FILE CHỮ VIỆT VĂN TỪ THƯ MỤC ASSETS (Webpack sẽ tự xử lý băm hash an toàn)
import vietVanText from "@/assets/logos/vietvan.png";

import { Geologica } from 'next/font/google';

// Khởi tạo font cấu hình riêng cho Tiếng Việt
const geologicaFont = Geologica({
  subsets: ['vietnamese'],
  display: 'swap',
});

// ──────────────────────────────────────────────────────────────
// 🛠️ CẤU HÌNH CHUỖI ẢNH TỰ ĐỘNG TỪ THƯ MỤC PUBLIC
// ──────────────────────────────────────────────────────────────
const START_FRAME = 1501; 
const END_FRAME = 1547; 

const INTRO_FRAMES = Array.from(
  { length: END_FRAME - START_FRAME + 1 },
  (_, i) => `/intro-frames/IMG_${START_FRAME + i}.png`
);

gsap.registerPlugin(useGSAP);
type IntroPhase = "revealing" | "interactive" | "exiting";

interface WaterLogoIntroProps {
  onComplete: () => void;
}

// Giữ màu vàng ngà sang trọng cổ kính cho toàn bộ chuỗi ảnh Rồng + Chữ
const LOGO_TINT = "none";

export function WaterLogoIntro({ onComplete }: WaterLogoIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animeImageRef = useRef<HTMLImageElement>(null); 
  const textRef = useRef<HTMLDivElement>(null); // 💡 Ref quản lý chữ Việt Văn
  const ropeGroupRef = useRef<HTMLDivElement>(null);
  const ropeLineRef = useRef<SVGLineElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<IntroPhase>("revealing");
  
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const pullOffsetRef = useRef(0);
  const [pullOffset, setPullOffset] = useState(0);
  const [ropeVisible, setRopeVisible] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>("revealing");
  const reducedMotion = useReducedMotion();

  // Preload ảnh tĩnh
  useEffect(() => {
    INTRO_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const syncPullOffset = useCallback((value: number) => {
    const clamped = Math.max(0, value);
    pullOffsetRef.current = clamped;
    setPullOffset(clamped);
  }, []);

  const finishIntro = useCallback(() => {
    if (phaseRef.current === "exiting") return;
    phaseRef.current = "exiting";
    setPhase("exiting");

    gsap.killTweensOf(ropeGroupRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
        onComplete();
      },
    });

    tl.to(beadRef.current, {
      y: pullOffsetRef.current + INTRO_ROPE.dropOffset,
      duration: INTRO_ROPE.successTugDuration,
      ease: INTRO_EASING.logoReveal.gsap,
    });

    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: INTRO_TIMING.introExit,
        ease: INTRO_EASING.exit.gsap,
      },
      "-=0.08",
    );
  }, [onComplete]);

  const snapRopeBack = useCallback(() => {
    gsap.to(pullOffsetRef, {
      current: 0,
      duration: 0.8,
      ease: "elastic.out(1.2, 0.4)",
      onUpdate: () => syncPullOffset(pullOffsetRef.current),
    });
  }, [syncPullOffset]);

  /* ── Kịch bản hoạt họa lật hình bằng GSAP ── */
  useGSAP(
    () => {
      const imgEl = animeImageRef.current;
      if (!imgEl) return;

      imgEl.src = INTRO_FRAMES[0];
      
      // 🟢 Dùng Ref cho các phần tử cha độc lập
      gsap.set(ropeGroupRef.current, { y: -25, opacity: 0 }); 
      gsap.set(textRef.current, { opacity: 1, y: 0 }); // GSAP tự xử lý nếu textRef tạm thời null
      
      // 🌟 SỬA TẠI ĐÂY: Truyền thẳng chuỗi ".char". 
      // GSAP tự tìm kiếm an toàn trong scope, không lo lỗi null của querySelectorAll nữa!
      gsap.set(".char", { opacity: 0, y: 60 }); 

      if (reducedMotion) {
        imgEl.src = INTRO_FRAMES[INTRO_FRAMES.length - 1];
        gsap.set(".char", { opacity: 1, y: 0 });
        gsap.set(ropeGroupRef.current, { y: 0, opacity: 1 });
        setRopeVisible(true);
        phaseRef.current = "interactive";
        setPhase("interactive");
        return;
      }

      const animationState = { currentFrame: 0 };
      const totalFrames = INTRO_FRAMES.length - 1;

      const revealTl = gsap.timeline({
        onComplete: () => {
          phaseRef.current = "interactive";
          setPhase("interactive");
          setRopeVisible(true);

          const idleTimeline = gsap.timeline();
          
          idleTimeline.to(ropeGroupRef.current, {
            y: 0,
            opacity: 1,
            duration: INTRO_TIMING.logoSettle,
            ease: INTRO_EASING.logoReveal.gsap,
          });

          idleTimeline.to(ropeGroupRef.current, {
            y: "+=4",
            duration: 1.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      });

      revealTl.to({}, { duration: INTRO_TIMING.darknessHold });

      // 1. Chạy chuyển động múa rồng frame-by-frame
      revealTl.to(animationState, {
        currentFrame: totalFrames,
        duration: INTRO_TIMING.logoReveal,
        ease: `steps(${totalFrames})`, 
        onUpdate: () => {
          const frameIndex = Math.round(animationState.currentFrame);
          if (INTRO_FRAMES[frameIndex]) {
            imgEl.src = INTRO_FRAMES[frameIndex];
          }
        },
      });

      // 2. Kích hoạt hiệu ứng Ramp Down đưa các chữ về gốc
      revealTl.to(
        ".char", // 🌟 SỬA TẠI ĐÂY: Thay thế textRef.current.querySelectorAll(".char") bằng chuỗi ".char"
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: {
            each: 0.06,
            from: "start"
          }
        },
        "-=0.2"
      );
    },
    { scope: containerRef, dependencies: [] }
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (phaseRef.current !== "interactive") return;
      isDraggingRef.current = true;
      dragStartYRef.current = e.clientY;
      dragStartOffsetRef.current = pullOffsetRef.current;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientY - dragStartYRef.current;
      syncPullOffset(dragStartOffsetRef.current + delta);
      e.preventDefault();
    },
    [syncPullOffset],
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (pullOffsetRef.current >= INTRO_ROPE.pullThreshold) {
        finishIntro();
      } else {
        snapRopeBack();
      }
    },
    [finishIntro, snapRopeBack],
  );

  const handlePointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      snapRopeBack();
    },
    [snapRopeBack],
  );

  const ropeLineLength = 45 + pullOffset; 

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
      style={{ backgroundColor: INTRO_ATMOSPHERE.stageBg }}
      role="dialog"
      aria-label="Màn mở đầu sân khấu nước"
      aria-modal="true"
    >
      <div className="flex flex-col items-center gap-0 w-full max-w-sm sm:max-w-md md:max-w-lg -translate-y-10 sm:-translate-y-16 md:-translate-y-20">
        
        {/* ── Khối chứa chuỗi ảnh Rồng 800x800px chuẩn hóa ── */}
        <div className="relative w-[70vw] sm:w-[400px] md:w-[480px] aspect-square flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={animeImageRef}
            alt="Việt Văn Animation"
            className="w-full h-full object-contain pointer-events-none will-change-[src]"
            style={{ filter: LOGO_TINT }}
          />
        </div>

        {/* ── KHỐI CHỨA CHỮ VIỆT VĂN (Chuẩn font text theo After Effects) ── */}
        <div 
          ref={textRef} 
          // 💡 Thêm geologicaFont.className vào đầu chuỗi class
          className={`${geologicaFont.className} w-[50vw] sm:w-[240px] md:w-[280px] pointer-events-none -mt-16 sm:-mt-28 md:-mt-25 mb-0 flex justify-center items-center text-white text-2xl sm:text-3xl tracking-[0.25em] font-medium select-none opacity-0`}
          style={{ filter: LOGO_TINT }}
        >
          {"VIỆT VĂN".split("").map((char, index) => {
            if (char === " ") return <span key={index} className="w-[0.5em]" aria-hidden="true" />;
            return (
              <span key={index} className="char inline-block will-change-transform opacity-0">
                {char}
              </span>
            );
          })}
        </div>

        {/* ── Dây lụa đỏ bám cố định dưới chân Chữ ── */}
        <div
          ref={ropeGroupRef}
          className="relative z-20 flex flex-col items-center"
          style={{
            touchAction: "none",
            visibility: ropeVisible || phase !== "revealing" ? "visible" : "hidden",
          }}
          aria-hidden={phase === "revealing"}
        >
          <svg width="2" height={ropeLineLength} className="overflow-visible" aria-hidden>
            <line
              ref={ropeLineRef}
              x1="1"
              y1="0"
              x2="1"
              y2={ropeLineLength}
              stroke="#8b1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 2px rgba(180, 40, 40, 0.4))" }}
            />
          </svg>

          <div className="relative flex flex-col items-center mt-1">
            <div
              ref={beadRef}
              role="button"
              tabIndex={phase === "interactive" ? 0 : -1}
              aria-label="Kéo dây mở màn"
              aria-disabled={phase !== "interactive"}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="relative cursor-grab active:cursor-grabbing z-30"
              style={{
                transform: `translateY(${pullOffset}px)`,
                touchAction: "none",
              }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0.5 h-2" style={{ background: "#6b1010" }} aria-hidden />
              <div
                className="w-7 h-7 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #f0c878, #c47a28 55%, #7a3f10 100%)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #fff8f0, #d4a88a 70%, #8b5a3c)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
                aria-hidden
              />
            </div>

            <p
              className="text-[10px] sm:text-xs tracking-wide whitespace-nowrap transition-opacity duration-700 mt-3 animate-pulse"
              style={{
                color: "rgba(220, 200, 180, 0.55)",
                fontFamily: "var(--font-geist-sans, system-ui)",
                opacity: phase === "interactive" && pullOffset < 15 ? 1 : 0,
              }}
            >
              Kéo xuống để mở màn
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}