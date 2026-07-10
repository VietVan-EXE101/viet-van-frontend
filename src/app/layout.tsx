import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro, Geologica } from "next/font/google";
import "./globals.css";

// ── Heading font: editorial serif, hỗ trợ tiếng Việt ──
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── Body font: sans hiện đại, tối ưu dấu tiếng Việt ──
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ── 🌟 Khởi tạo Font Geologica hợp lệ ở Server Component ──
const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// ── Metadata ──
// [DESIGNER_SLOT] og:image — Designer cung cấp ảnh hero chính thức
export const metadata: Metadata = {
  title: "Việt Văn — Văn chương dân gian Việt, luyện nói tiếng Việt",
  description:
    "Nền tảng đọc truyện dân gian Việt Nam, luyện nói tiếng Việt chuẩn và học tương tác cùng công nghệ AI.",
  openGraph: {
    title: "Việt Văn — Sân khấu văn học dân gian",
    description: "Văn chương dân gian, kể lại bằng giọng của bạn.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }], // [DESIGNER_SLOT]
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${beVietnam.variable} ${geologica.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-stage text-white">
        {children}
      </body>
    </html>
  );
}