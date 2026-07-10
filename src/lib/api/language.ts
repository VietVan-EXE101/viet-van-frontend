import { getLocalLanguageSceneById } from "@/data/chi-pheo-language";

export interface LanguageHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  termVi: string;
  translationEn?: string;
  category?: string;
  description?: string;
  audioUrl?: string;
}

export interface LanguageScene {
  id: string;
  workSlug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAspectRatio: string;
  hotspots: LanguageHotspot[];
}

export async function getLanguageSceneById(
  id: string,
): Promise<LanguageScene | null> {
  return getLocalLanguageSceneById(id);
}
