/**
 * src/scenes/home-scene/sections/JoinSection.tsx
 *
 * Section "Join" — email signup, centered.
 * Form submit → gọi api.post("/auth/register", { email })
 */
"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";

export function JoinSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      await api.post("/auth/register", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="join"
      className="w-full px-6 md:px-16 py-20 md:py-28 flex flex-col items-center text-center bg-white"
    >
      {/* TIÊU ĐỀ: Đổi sang màu đen, font chữ thon gọn thanh lịch chữ đậm vừa phải */}
      <h2
        className="font-body text-black text-3xl md:text-[40px] font-medium tracking-tight leading-none mb-3"
        style={{ fontFamily: "var(--font-geist-sans, system-ui)" }}
      >
        Join
      </h2>

      {/* MÔ TẢ: Đổi sang màu chữ xám tối, nét mỏng font-light */}
      <p
        className="font-body text-sm md:text-[15px] leading-relaxed text-black mb-8 max-w-md"
      >
        Step into the theater. Your account opens the door.
      </p>

      {status === "success" ? (
        <p className="text-sm text-green-600 font-light">
          ✓ Đã nhận. Chúng tôi sẽ liên hệ sớm.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-stretch gap-2 w-full max-w-md"
        >
          {/* Ô INPUT:
              - Nền trắng, viền đen mảnh (border-black/80).
              - rounded-none để tạo góc vuông hoàn toàn theo Figma.
          */}
          <input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            className="flex-1 px-4 py-2.5 rounded-none text-sm text-black placeholder-black/25 bg-white outline-none transition-all duration-200"
            style={{
              border: status === "error"
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(0, 0, 0, 0.8)",
            }}
          />

          {/* NÚT SIGN UP:
              - Chuyển thành màu nền đen (bg-black), chữ trắng.
              - rounded-none loại bỏ hoàn toàn độ bo góc.
          */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2.5 rounded-none text-sm font-light text-white bg-black border border-black transition-all duration-200 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {status === "loading" ? "..." : "Sign up"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-600 font-light">
          Có lỗi xảy ra. Vui lòng thử lại.
        </p>
      )}

      {/* ĐIỀU KHOẢN: Chuyển sang chữ xám nhỏ mỏng bám sát lề chân form */}
      <p
        className="mt-4 text-[11px] font-light text-black"
      >
        By signing up you agree to our{" "}
        <a href="#" className="underline underline-offset-2 text-black/70 hover:text-black transition-colors">
          Terms and Conditions
        </a>
        .
      </p>
    </section>
  );
}