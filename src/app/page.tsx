// src/app/page.tsx
import { HomePage } from "@/scenes/home-scene/HomePage";

export const metadata = {
  title: "Home - Viet Van",
  description: "Sân khấu văn học và văn hóa dân gian tương tác Việt Nam",
};

export default function RootPage() {
  return <HomePage />;
}