// src/lib/api/quote.ts
// ══════════════════════════════════════════════════════════════
// QUOTE API — Ca dao / tục ngữ cho QuoteBand section
// [API_SLOT] GET /api/v1/quotes/daily
// ══════════════════════════════════════════════════════════════

import type { ApiResult } from "./types";
import { API } from "./endpoints";


export interface DailyQuote {
  id: string;
  text: string;       // Câu ca dao / tục ngữ
  source: string;     // Nguồn — ví dụ: "Ca dao Nam Bộ"
  region: string;     // Vùng miền
  explanation: string; // Giải nghĩa ngắn
}



/**
 * [API_SLOT] GET /api/v1/quotes/daily
 * Backend rotate câu quote mỗi ngày (cache theo ngày)
 */
export async function getDailyQuote(): Promise<
  ApiResult<{ quote: DailyQuote }>
> {
    const res = await fetch(API.quotes.daily, { next: { revalidate: 86400, tags: ["daily-quote"] } });


  if (!res.ok) {
    return {
      error: {
        code: "QUOTE_FETCH_FAILED",
        message: "Không thể tải câu trích dẫn",
        statusCode: res.status,
      },
    };
  }

  return res.json();
}