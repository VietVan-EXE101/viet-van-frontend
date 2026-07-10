// src/lib/api/stories.ts

import { api } from "./client";
import { API } from "./endpoints";
import type {
  ApiResult,
  StoryGenre,
  DifficultyLevel,
} from "./types";

// ── Interfaces ────────────────────────────────────────────────

export interface Story {
  id: string;
  slug: string;
  title: string;

  // Backend chưa chắc đã trả toàn bộ các trường này,
  // nên để optional trong giai đoạn tích hợp MVP.
  author?: string;
  shortDescription?: string;
  genre?: StoryGenre;
  difficulty?: DifficultyLevel;
  readingTimeMinutes?: number;
  coverUrl?: string | null;
  audioPreviewUrl?: string | null;
  tags?: string[];
  publishedAt?: string;
  isPublished?: boolean;
}

export interface StoriesResponse {
  stories: Story[];
}

export interface StoryDetailResponse {
  story: Story & {
    content?: StoryChapter[];
    relatedStories?: Pick<
      Story,
      "id" | "slug" | "title" | "coverUrl"
    >[];
  };
}

export interface StoryChapter {
  id: string;
  order: number;
  title: string;
  body: string;
}

// ── Query params ──────────────────────────────────────────────

export interface StoriesQueryParams {
  genre?: StoryGenre;
  difficulty?: DifficultyLevel;
  featured?: boolean;
  limit?: number;
  page?: number;
}

function buildQueryString(params: StoriesQueryParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

/**
 * GET /api/v1/stories
 */
export async function getStories(
  params: StoriesQueryParams = {},
): Promise<ApiResult<StoriesResponse>> {
  const query = buildQueryString(params);

  const path = query
    ? `${API.stories.list}?${query}`
    : API.stories.list;

  try {
    return await api.get<ApiResult<StoriesResponse>>(path);
  } catch (error) {
    console.error("getStories failed:", error);

    return {
      error: {
        code: "STORIES_FETCH_FAILED",
        message: "Không thể tải danh sách tác phẩm",
        statusCode: 500,
      },
    };
  }
}

/**
 * GET /api/v1/stories?featured=true&limit=4
 */
export async function getFeaturedStories(
  params: StoriesQueryParams = {},
): Promise<ApiResult<StoriesResponse>> {
  return getStories({
    ...params,
    featured: true,
    limit: params.limit ?? 4,
  });
}

/**
 * GET /api/v1/stories/:slug
 */
export async function getStoryBySlug(
  slug: string,
): Promise<ApiResult<StoryDetailResponse>> {
  if (!slug.trim()) {
    return {
      error: {
        code: "INVALID_STORY_SLUG",
        message: "Slug tác phẩm không hợp lệ",
        statusCode: 400,
      },
    };
  }

  try {
    return await api.get<ApiResult<StoryDetailResponse>>(
      API.stories.detail(slug),
    );
  } catch (error) {
    console.error(`getStoryBySlug failed: ${slug}`, error);

    return {
      error: {
        code: "STORY_NOT_FOUND",
        message: `Không thể tải tác phẩm: ${slug}`,
        statusCode: 500,
      },
    };
  }
}