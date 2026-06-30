// src/lib/api/learn.ts
// ══════════════════════════════════════════════════════════════
// LEARN API
// [API_SLOT] Base URL: /api/v1/learn
// Backend owner: 3 module học: flashcard, quiz, annotation
// ══════════════════════════════════════════════════════════════

import type { ApiResult, DifficultyLevel } from "./types";
import { API } from "./endpoints";


// ── Interfaces ─────────────────────────────────────────────────

/** Flashcard từ vựng cổ */
export interface Flashcard {
  id: string;
  term: string;           // Từ cổ / điển tích — ví dụ: "nguyệt lão"
  definition: string;     // Giải thích hiện đại
  exampleSentence: string;
  storyReference: string; // Truyện xuất hiện từ này
  difficulty: DifficultyLevel;

  // [DESIGNER_SLOT] illustrationUrl — Designer vẽ minh họa nhỏ cho từng flashcard
  // Kích thước: 200 × 200px, phong cách tranh khắc gỗ Đông Hồ
  illustrationUrl: string | null;
}

/** Quiz hiểu truyện */
export interface QuizQuestion {
  id: string;
  storyId: string;
  question: string;
  options: QuizOption[];
  difficulty: DifficultyLevel;
  explanation: string; // Giải thích đáp án sau khi trả lời
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Giải nghĩa điển tích */
export interface Annotation {
  id: string;
  term: string;           // Điển tích — ví dụ: "Tứ đức, Tam tòng"
  origin: string;         // Nguồn gốc lịch sử/văn học
  modernMeaning: string;  // Ý nghĩa hiện đại
  usageExample: string;

  // [API_SLOT] relatedStoryIds — Backend link đến các truyện có điển tích này
  relatedStoryIds: string[];
}

/** Response tổng hợp cho LearnModule section trên homepage */
export interface LearnModulePreview {
  featuredFlashcard: Flashcard;
  featuredQuiz: QuizQuestion;
  featuredAnnotation: Annotation;
  totalFlashcards: number;
  totalQuizzes: number;
  totalAnnotations: number;
}



/**
 * Lấy preview 3 module học cho homepage
 * [API_SLOT] GET /api/v1/learn/preview
 * Backend trả 1 item nổi bật từ mỗi module + tổng số lượng
 */
export async function getLearnModulePreview(): Promise<
  ApiResult<{ preview: LearnModulePreview }>
> {
const res = await fetch(API.learn.preview, { next: { revalidate: 3600 } });


  if (!res.ok) {
    return {
      error: {
        code: "LEARN_FETCH_FAILED",
        message: "Không thể tải module học",
        statusCode: res.status,
      },
    };
  }

  return res.json();
}