// src/lib/api/speaking.ts
// ══════════════════════════════════════════════════════════════
// SPEAKING API
// [API_SLOT] Base URL: /api/v1/speaking
// Backend owner: cần implement AI pronunciation scoring
// ══════════════════════════════════════════════════════════════

import { API } from "./endpoints";
import type { ApiResult, RegionDialect, DifficultyLevel } from "./types";


// ── Interfaces ─────────────────────────────────────────────────

export interface SpeakingExcerpt {
  id: string;
  storyId: string;
  storyTitle: string;
  text: string;           // Đoạn văn để đọc
  dialect: RegionDialect; // Phương ngữ chuẩn của đoạn này
  difficulty: DifficultyLevel;

  // [API_SLOT] referenceAudioUrl — Backend trả về audio mẫu (giọng chuẩn)
  referenceAudioUrl: string | null;

  wordCount: number;
  estimatedDurationSeconds: number;
}

export interface SpeakingSubmission {
  excerptId: string;
  // [API_SLOT] audioBlob sẽ được gửi dưới dạng multipart/form-data
  // Backend nhận file audio → chạy AI scoring → trả về SpeakingResult
}

export interface SpeakingResult {
  submissionId: string;
  overallScore: number;     // 0–100
  pronunciationScore: number;
  fluencyScore: number;
  toneScore: number;        // Thanh điệu tiếng Việt (quan trọng)

  wordResults: WordResult[];
  feedback: string;         // Nhận xét tổng hợp từ AI
  suggestedWords: string[]; // Từ cần luyện thêm
}

export interface WordResult {
  word: string;
  isCorrect: boolean;
  score: number;
  // [API_SLOT] phoneme-level detail — nếu Backend AI hỗ trợ
  phonemeDetail?: string;
}



/**
 * Lấy đoạn trích để luyện nói — hiển thị ở SpeakingModule section
 * [API_SLOT] GET /api/v1/speaking/excerpts/featured
 * Backend trả 1 đoạn trích nổi bật cho homepage
 */
export async function getFeaturedExcerpt(): Promise<
  ApiResult<{ excerpt: SpeakingExcerpt }>
> {
  const res = await fetch(API.speaking.featuredExcerpt, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    return {
      error: {
        code: "EXCERPT_FETCH_FAILED",
        message: "Không thể tải đoạn trích",
        statusCode: res.status,
      },
    };
  }

  return res.json();
}

/**
 * Submit audio để AI chấm điểm
 * [API_SLOT] POST /api/v1/speaking/submit
 * Body: multipart/form-data { excerptId, audio: File }
 * Backend: nhận audio → AI scoring → trả SpeakingResult
 */
export async function submitSpeakingAudio(
  excerptId: string,
  audioBlob: Blob
): Promise<ApiResult<{ result: SpeakingResult }>> {
  const form = new FormData();
  form.append("excerptId", excerptId);
  form.append("audio", audioBlob, "recording.webm");

  const res = await fetch(API.speaking.submit, {
    method: "POST",
    body: form,
    // [API_SLOT] Authorization header — khi có auth thì thêm vào đây
    // headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return {
      error: {
        code: "SUBMIT_FAILED",
        message: "Không thể gửi bản ghi âm",
        statusCode: res.status,
      },
    };
  }

  return res.json();
}