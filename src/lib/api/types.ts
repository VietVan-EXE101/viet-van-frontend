// src/lib/api/types.ts
// ══════════════════════════════════════════════════════════════
// SHARED TYPES — Toàn bộ API response đi qua wrapper này
// Backend cần tuân theo contract này khi implement endpoint
// ══════════════════════════════════════════════════════════════

/** Wrapper chuẩn cho mọi API response */
export interface ApiResponse<T> {
    data: T;
    meta?: ResponseMeta;
    error?: never;
  }
  
  export interface ApiError {
    data?: never;
    error: {
      code: string;
      message: string;
      statusCode: number;
    };
  }
  
  export interface ResponseMeta {
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
  }
  
  export type ApiResult<T> = ApiResponse<T> | ApiError;
  
  // ── Enums ──────────────────────────────────────────────────────
  
  export type StoryGenre =
    | "truyen-co-tich"   // Truyện cổ tích
    | "truyen-truyen-thuyet" // Truyền thuyết
    | "truyen-ngu-ngon"  // Ngụ ngôn
    | "truyen-cuoi";     // Truyện cười
  
  export type DifficultyLevel = "co-ban" | "trung-cap" | "nang-cao";
  
  export type RegionDialect = "bac" | "trung" | "nam";