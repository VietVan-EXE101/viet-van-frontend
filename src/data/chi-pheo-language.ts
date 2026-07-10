import type { LanguageScene } from "@/lib/api/language";

const CHI_PHEO_LANGUAGE_SCENE: LanguageScene = {
  id: "chi-pheo-bat-chao-hanh",
  workSlug: "chi-pheo",
  title: "Khám phá ngôn ngữ trong Chí Phèo",
  description:
    "Chạm vào nhân vật hoặc đồ vật trong phân cảnh để học từ mới.",
  imageUrl: "/images/language-mode/chi-pheo-bat-chao-hanh.png",
  imageAspectRatio: "700 / 367",
  hotspots: [
    {
      id: "thi-no",
      xPercent: 53,
      yPercent: 55,
      widthPercent: 25,
      heightPercent: 68,
      termVi: "Thị Nở",
      translationEn: "Thi No",
      category: "Nhân vật",
      description:
        "Người mang bát cháo hành đến chăm sóc Chí Phèo.",
    },
    {
      id: "chi-pheo",
      xPercent: 78,
      yPercent: 51,
      widthPercent: 25,
      heightPercent: 76,
      termVi: "Chí Phèo",
      translationEn: "Chi Pheo",
      category: "Nhân vật",
      description:
        "Nhân vật chính trong tác phẩm Chí Phèo của Nam Cao.",
    },
    {
      id: "bat-chao-hanh",
      xPercent: 61,
      yPercent: 39,
      widthPercent: 13,
      heightPercent: 14,
      termVi: "Bát cháo hành",
      translationEn: "Bowl of onion porridge",
      category: "Đồ ăn",
      description:
        "Chi tiết thể hiện sự quan tâm và tình người trong phân cảnh.",
    },
    {
      id: "noi-chao",
      xPercent: 16,
      yPercent: 68,
      widthPercent: 18,
      heightPercent: 30,
      termVi: "Nồi cháo",
      translationEn: "Porridge pot",
      category: "Đồ vật",
    },
    {
      id: "cay-chuoi",
      xPercent: 26,
      yPercent: 29,
      widthPercent: 29,
      heightPercent: 57,
      termVi: "Cây chuối",
      translationEn: "Banana tree",
      category: "Cây cối",
    },
    {
      id: "rom",
      xPercent: 85,
      yPercent: 78,
      widthPercent: 25,
      heightPercent: 29,
      termVi: "Rơm",
      translationEn: "Straw",
      category: "Cảnh vật",
    },
  ],
};

export function getLocalLanguageSceneById(
  id: string,
): LanguageScene | null {
  if (id !== CHI_PHEO_LANGUAGE_SCENE.id) {
    return null;
  }

  return CHI_PHEO_LANGUAGE_SCENE;
}
