// src/app/library/page.tsx
import { LibraryPage } from "@/scenes/library-scene/LibraryPage";

// Bạn có thể thêm SEO Metadata ở đây nếu muốn trang chuẩn SEO hơn
export const metadata = {
  title: "Library - Viet Van",
  description: "Thư viện tác phẩm nghệ thuật và sân khấu cổ truyền Việt Nam",
};

export default function Page() {
  return <LibraryPage />;
}