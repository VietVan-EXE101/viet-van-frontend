"use client";

import { useSyncExternalStore } from "react";

// 1. Hàm đăng ký lắng nghe sự thay đổi từ trình duyệt
const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

// 2. Hàm lấy giá trị hiện tại ở phía Client
const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// 3. Giá trị mặc định khi chạy trên Server (SSR) để tránh lỗi Hydration
const getServerSnapshot = () => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}