/**
 * src/components/layout/Footer.tsx
 * 
 * Đã tinh chỉnh đồng bộ Layout rộng max-w-7xl, thêm icon LinkedIn 
 * và căn giữa toàn bộ dòng bản quyền phía dưới chuẩn Figma.
 */
import Link from "next/link";
import Image from "next/image";
import picLogo from "@/assets/logos/pic_logo.png";

const FOOTER_LINKS = ["About us", "Features", "Contact", "Support", "Careers"];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter/X",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-black pt-16 pb-12 px-6 md:px-16">
      {/* KHỐI ĐỊNH VỊ TRUNG TÂM: max-w-7xl giúp canh lề chuẩn xác với các section phía trên */}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Hàng chính: Logo - Điều hướng - Mạng xã hội */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image 
              src={picLogo} 
              alt="Việt Văn" 
              width={24} 
              height={24} 
              className="object-contain opacity-90 brightness-110" 
            />
            <span className="text-white text-sm font-medium tracking-widest">VIỆT VĂN</span>
          </Link>

          {/* Menu Links điều hướng */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                className="text-xs text-white/60 hover:text-white transition-colors duration-200 tracking-wide font-light"
              >
                {link}
              </Link>
            ))}
          </nav>

          {/* Hệ thống 5 Social Icons đầy đủ của Figma */}
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* ĐƯỜNG KẺ CHIA TÁCH PHÂN KHU CHÂN TRANG */}
        <div className="w-full h-[1px] bg-white/10" />

        {/* THANH BẢN QUYỀN CHÂN TRANG: Gom cụm và căn giữa toàn bộ inline đúng Figma */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-3 text-center">
          <p className="text-xs text-white/40 font-light">
            © 2026 Viet Van. All rights reserved.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {["Privacy policy", "Terms of service", "Cookie settings"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 font-light"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}