// src/lib/api/endpoints.ts
// ══════════════════════════════════════════════════════════════
// API REGISTRY — Nguồn chân lý duy nhất cho toàn bộ endpoints
// ──────────────────────────────────────────────────────────────
// Frontend  : import constant từ file này, KHÔNG hardcode URL
// Backend   : implement đúng method + path + contract bên dưới
// ══════════════════════════════════════════════════════════════
// ──────────────────────────────────────────────────────────────
// 📚 STORIES
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  GET  /api/v1/stories
//       Query: featured?, genre?, difficulty?, limit?, page?
//       Response: { data: { stories: Story[] }, meta: ResponseMeta }
//
//  GET  /api/v1/stories/:slug
//       Response: { data: { story: Story & { content, relatedStories } } }
// ──────────────────────────────────────────────────────────────
export const STORIES_ENDPOINTS = {
  list: "/api/v1/stories",
  detail: (slug: string) => `/api/v1/stories/${slug}`}

// ──────────────────────────────────────────────────────────────
// 🎙️ SPEAKING
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  GET  /api/v1/speaking/excerpts/featured
//       Response: { data: { excerpt: SpeakingExcerpt } }
//
//  GET  /api/v1/speaking/excerpts
//       Query: storyId?, dialect?, difficulty?, limit?, page?
//       Response: { data: { excerpts: SpeakingExcerpt[] }, meta: ResponseMeta }
//
//  POST /api/v1/speaking/submit
//       Body   : multipart/form-data { excerptId: string, audio: File (.webm/.mp3) }
//       Auth   : Bearer token (khi có auth)
//       Response: { data: { result: SpeakingResult } }
// ──────────────────────────────────────────────────────────────
//export const SPEAKING_ENDPOINTS = {
//  featuredExcerpt: `${BASE}/api/v1/speaking/excerpts/featured`,
//  excerptList:     `${BASE}/api/v1/speaking/excerpts`,
//  submit:          `${BASE}/api/v1/speaking/submit`,
//} as const;

// ──────────────────────────────────────────────────────────────
// 📖 LEARN
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  GET  /api/v1/learn/preview
//       Response: { data: { preview: LearnModulePreview } }
//       (1 flashcard + 1 quiz + 1 annotation nổi bật + tổng số từng loại)
//
//  GET  /api/v1/learn/flashcards
//       Query: storyId?, difficulty?, limit?, page?
//       Response: { data: { flashcards: Flashcard[] }, meta: ResponseMeta }
//
//  GET  /api/v1/learn/quizzes
//       Query: storyId?, difficulty?, limit?, page?
//       Response: { data: { questions: QuizQuestion[] }, meta: ResponseMeta }
//
//  GET  /api/v1/learn/annotations
//       Query: storyId?, limit?, page?
//       Response: { data: { annotations: Annotation[] }, meta: ResponseMeta }
// ──────────────────────────────────────────────────────────────
//export const LEARN_ENDPOINTS = {
//  preview:     `${BASE}/api/v1/learn/preview`,
//  flashcards:  `${BASE}/api/v1/learn/flashcards`,
//  quizzes:     `${BASE}/api/v1/learn/quizzes`,
//  annotations: `${BASE}/api/v1/learn/annotations`,
//} as const;

// ──────────────────────────────────────────────────────────────
// 💬 QUOTES
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  GET  /api/v1/quotes/daily
//       Cache: rotate mỗi 24h theo ngày (server-side)
//       Response: { data: { quote: DailyQuote } }
// ──────────────────────────────────────────────────────────────
//export const QUOTE_ENDPOINTS = {
//  daily: `${BASE}/api/v1/quotes/daily`,
//} as const;
//
//// ──────────────────────────────────────────────────────────────
// 👤 AUTH  (chuẩn bị sẵn — chưa implement UI)
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  POST /api/v1/auth/register
//       Body: { email, password, displayName }
//
//  POST /api/v1/auth/login
//       Body: { email, password }
//       Response: { data: { accessToken, refreshToken, user: UserProfile } }
//
//  POST /api/v1/auth/refresh
//       Body: { refreshToken }
//       Response: { data: { accessToken } }
//
//  POST /api/v1/auth/logout
//       Auth: Bearer token
// ──────────────────────────────────────────────────────────────
//export const AUTH_ENDPOINTS = {
//  register: `${BASE}/api/v1/auth/register`,
//  login:    `${BASE}/api/v1/auth/login`,
//  refresh:  `${BASE}/api/v1/auth/refresh`,
//  logout:   `${BASE}/api/v1/auth/logout`,
//} as const;
//
//// ──────────────────────────────────────────────────────────────
// 📊 USER PROGRESS  (chuẩn bị sẵn — chưa implement UI)
// ──────────────────────────────────────────────────────────────
// [API_SLOT] Backend cần implement:
//
//  GET  /api/v1/users/me/progress
//       Auth: Bearer token
//       Response: tiến độ đọc truyện, điểm luyện nói, flashcard đã học
//
//  POST /api/v1/users/me/progress
//       Auth: Bearer token
//       Body: { type: "story"|"speaking"|"flashcard", refId, data }
// ──────────────────────────────────────────────────────────────
//export const USER_ENDPOINTS = {
//  progress:       `${BASE}/api/v1/users/me/progress`,
//  updateProgress: `${BASE}/api/v1/users/me/progress`,
//} as const;
//
//// ══════════════════════════════════════════════════════════════
// MASTER MAP — Tham chiếu nhanh toàn bộ
// ══════════════════════════════════════════════════════════════
//export const API = {
//  stories:  STORIES_ENDPOINTS,
//  speaking: SPEAKING_ENDPOINTS,
//  learn:    LEARN_ENDPOINTS,
//  quotes:   QUOTE_ENDPOINTS,
//  auth:     AUTH_ENDPOINTS,
//  user:     USER_ENDPOINTS,
//} as const;