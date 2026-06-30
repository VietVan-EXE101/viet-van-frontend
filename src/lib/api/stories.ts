// src/lib/api/stories.ts
// ══════════════════════════════════════════════════════════════
// STORIES API
// [API_SLOT] Base URL: GET /api/v1/stories
// Backend owner: cần implement endpoint trả về danh sách truyện
// ══════════════════════════════════════════════════════════════

import { API } from "./endpoints";
import type { ApiResult, StoryGenre, DifficultyLevel } from "./types";


// ── Interfaces ─────────────────────────────────────────────────

export interface Story {
  id: string;
  slug: string;
  title: string;                  // "Tấm Cám"
  shortDescription: string;       // 1-2 câu tóm tắt
  genre: StoryGenre;
  difficulty: DifficultyLevel;
  readingTimeMinutes: number;

  // [DESIGNER_SLOT] coverUrl — Designer cung cấp artwork phong cách Đông Hồ/sơn mài
  // Kích thước chuẩn: 400 × 560px (tỉ lệ poster dọc 5:7), định dạng WebP
  coverUrl: string | null;

  // [API_SLOT] audioPreviewUrl — Backend trả về URL presigned S3/CDN
  audioPreviewUrl: string | null;

  tags: string[];
  publishedAt: string; // ISO 8601
  isPublished: boolean;
}

export interface FeaturedStoriesResponse {
  stories: Story[];
}

export interface StoryDetailResponse {
  story: Story & {
    content: StoryChapter[];
    relatedStories: Pick<Story, "id" | "slug" | "title" | "coverUrl">[];
  };
}

export interface StoryChapter {
  id: string;
  order: number;
  title: string;
  body: string; // HTML hoặc Markdown — Backend quyết định format
}

// ── Query params ───────────────────────────────────────────────

export interface StoriesQueryParams {
  genre?: StoryGenre;
  difficulty?: DifficultyLevel;
  featured?: boolean;
  limit?: number;
  page?: number;
}


/**
 * Lấy danh sách truyện nổi bật cho Hero / FeaturedStories section
 * [API_SLOT] GET /api/v1/stories?featured=true&limit=4
 */
export async function getFeaturedStories(
  params: StoriesQueryParams = { featured: true, limit: 4 }
): Promise<ApiResult<FeaturedStoriesResponse>> {

  // ✅ Sửa fetch trong getFeaturedStories thành
// Build query string từ params object
const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const url = params.featured
    ? API.stories.featured
    : `${API.stories.list}?${query}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return {
      error: {
        code: "STORIES_FETCH_FAILED",
        message: "Không thể tải danh sách truyện",
        statusCode: res.status,
      },
    };
  }

  return res.json();
}

/**
 * Lấy chi tiết 1 truyện theo slug
 * [API_SLOT] GET /api/v1/stories/:slug
 */
export async function getStoryBySlug(
  slug: string
): Promise<ApiResult<StoryDetailResponse>> {
  const res = await fetch(API.stories.detail(slug), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return {
      error: {
        code: "STORY_NOT_FOUND",
        message: `Không tìm thấy truyện: ${slug}`,
        statusCode: res.status,
      },
    };
  }

  return res.json();
}