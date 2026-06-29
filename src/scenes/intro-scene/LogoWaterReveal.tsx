"use client";

import Image from "next/image";
import logoImage from "@/assets/logos/logo.png";

interface LogoWaterRevealProps {
  revealRef: React.RefObject<HTMLDivElement | null>;
  waveRef: React.RefObject<SVGSVGElement | null>;
  shimmerRef: React.RefObject<HTMLDivElement | null>;
}

export function LogoWaterReveal({
  revealRef,
  waveRef,
  shimmerRef,
}: LogoWaterRevealProps) {
  const logoSrc = logoImage.src;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6">
      {/* Logo ghost — trước khi nước rửa */}
      <div className="relative w-44 sm:w-56 md:w-64 aspect-[0.72]">
        <Image
          src={logoImage}
          alt=""
          fill
          priority
          className="object-contain opacity-[0.1] select-none"
          aria-hidden
        />

        {/* Logo revealed — mask theo hình + mực nước dâng */}
        <div
          ref={revealRef}
          className="absolute inset-0"
          style={
            {
              "--reveal": "0%",
              WebkitMaskImage: `
                linear-gradient(
                  to top,
                  black var(--reveal),
                  transparent calc(var(--reveal) + 6%)
                ),
                url(${logoSrc})
              `,
              maskImage: `
                linear-gradient(
                  to top,
                  black var(--reveal),
                  transparent calc(var(--reveal) + 6%)
                ),
                url(${logoSrc})
              `,
              WebkitMaskSize: "100% 100%, contain",
              maskSize: "100% 100%, contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center, center",
              maskPosition: "center, center",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            } as React.CSSProperties
          }
        >
          <Image
            src={logoImage}
            alt="Việt Văn"
            fill
            priority
            className="object-contain select-none"
          />

          {/* Lớp phản chiếu nước trên logo */}
          <div
            ref={shimmerRef}
            className="absolute inset-0 opacity-0 mix-blend-soft-light"
            style={{
              background: `linear-gradient(
                160deg,
                transparent 30%,
                rgba(120, 200, 210, 0.35) 50%,
                transparent 70%
              )`,
            }}
          />
        </div>

        {/* Sóng nhẹ tại mép mực nước */}
        <svg
          ref={waveRef}
          className="absolute left-0 right-0 w-full opacity-0"
          style={{ top: "calc(100% - var(--reveal, 0%))" }}
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,12 C50,4 100,20 150,12 C200,4 250,20 300,12 C350,4 400,12 400,12 L400,24 L0,24 Z"
            fill="url(#wave-gradient)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a6b7a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1a6b7a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}