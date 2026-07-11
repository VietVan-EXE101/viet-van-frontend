"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  INTRO_TIMING,
  INTRO_EASING,
  INTRO_STORAGE_KEY,
} from "./intro.config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const START_FRAME = 1501;
const END_FRAME = 1547;

const INTRO_FRAMES = Array.from(
  { length: END_FRAME - START_FRAME + 1 },
  (_, i) => `/intro-frames/IMG_${START_FRAME + i}.PNG`,
);

gsap.registerPlugin(useGSAP);

type IntroPhase = "revealing" | "interactive" | "exiting";

interface WaterLogoIntroProps {
  onComplete: () => void;
}

const LOGO_TINT = "none";

export function WaterLogoIntro({ onComplete }: WaterLogoIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animeImageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const actionGroupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const phaseRef = useRef<IntroPhase>("revealing");

  const [actionVisible, setActionVisible] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>("revealing");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    INTRO_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const finishIntro = useCallback(() => {
    if (phaseRef.current === "exiting") return;
    phaseRef.current = "exiting";
    setPhase("exiting");

    gsap.killTweensOf(actionGroupRef.current);
    gsap.killTweensOf(buttonRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
        onComplete();
      },
    });

    tl.to(buttonRef.current, {
      scale: 0.96,
      duration: 0.16,
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

  useGSAP(
    () => {
      const imgEl = animeImageRef.current;
      if (!imgEl) return;

      imgEl.src = INTRO_FRAMES[0];

      gsap.set(actionGroupRef.current, { y: 12, opacity: 0 });
      gsap.set(textRef.current, { opacity: 1, y: 0 });
      gsap.set(".char", { opacity: 0, y: 60 });

      if (reducedMotion) {
        imgEl.src = INTRO_FRAMES[INTRO_FRAMES.length - 1];
        gsap.set(".char", { opacity: 1, y: 0 });
        gsap.set(actionGroupRef.current, { y: 0, opacity: 1 });
        setActionVisible(true);
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
          setActionVisible(true);

          gsap.to(actionGroupRef.current, {
            y: 0,
            opacity: 1,
            duration: INTRO_TIMING.logoSettle,
            ease: INTRO_EASING.logoReveal.gsap,
          });
        },
      });

      revealTl.to({}, { duration: INTRO_TIMING.darknessHold });

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

      revealTl.to(
        ".char",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: {
            each: 0.06,
            from: "start",
          },
        },
        "-=0.2",
      );
    },
    { scope: containerRef, dependencies: [] },
  );

  const handleActionClick = useCallback(() => {
    if (phaseRef.current !== "interactive") return;
    finishIntro();
  }, [finishIntro]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
      role="dialog"
      aria-label="Màn mở đầu sân khấu nước"
      aria-modal="true"
    >
      <div className="flex flex-col items-center gap-0 w-full max-w-sm sm:max-w-md md:max-w-lg -translate-y-10 sm:-translate-y-16 md:-translate-y-20">
        <div className="relative w-[70vw] sm:w-[400px] md:w-[480px] aspect-square flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={animeImageRef}
            alt="Việt Văn Animation"
            className="w-full h-full object-contain pointer-events-none will-change-[src]"
            style={{ filter: LOGO_TINT }}
          />
        </div>

        <div
          ref={textRef}
          className="font-geologica w-[50vw] sm:w-[240px] md:w-[280px] pointer-events-none -mt-16 sm:-mt-28 md:-mt-25 mb-0 flex justify-center items-center text-white text-2xl sm:text-3xl tracking-[0.25em] font-medium select-none opacity-0"
          style={{ filter: LOGO_TINT }}
        >
          {"VIỆT VĂN".split("").map((char, index) => {
            if (char === " ") {
              return (
                <span
                  key={index}
                  className="w-[0.5em]"
                  aria-hidden="true"
                />
              );
            }

            return (
              <span
                key={index}
                className="char inline-block will-change-transform opacity-0"
              >
                {char}
              </span>
            );
          })}
        </div>

        <div
          ref={actionGroupRef}
          className="relative z-20 mt-7 flex flex-col items-center"
          style={{
            visibility:
              actionVisible || phase !== "revealing" ? "visible" : "hidden",
          }}
          aria-hidden={phase === "revealing"}
        >
          <button
            ref={buttonRef}
            type="button"
            disabled={phase !== "interactive"}
            onClick={handleActionClick}
            className="group flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#343434] bg-[radial-gradient(circle_at_35%_28%,#2b2b2b_0%,#111_44%,#050505_100%)] text-[#b8b8b8] shadow-[0_12px_28px_rgba(0,0,0,0.42),inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-8px_18px_rgba(0,0,0,0.55)] transition-[transform,box-shadow,border-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#b8944d]/70 hover:text-[#f3dfad] hover:shadow-[0_15px_32px_rgba(0,0,0,0.46),0_0_16px_rgba(206,164,72,0.12),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d77b]"
            aria-label="Mở màn, chạm để bước vào sân khấu"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            >
              <path
                d="M12 3.75V11"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M7.05 6.85A7 7 0 1 0 16.95 6.85"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
