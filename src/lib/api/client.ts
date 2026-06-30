/**
 * src/lib/api/client.ts
 *
 * HTTP client toàn cục — đọc base URL từ biến môi trường.
 * Khi dùng ngrok: set NEXT_PUBLIC_API_URL=https://xxxx.ngrok-free.app trong .env.local
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Generic fetcher (dùng khi không cần body phức tạp) ──────────────────────

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  token?: string; // JWT nếu cần
};

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;

  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${method} ${path} → ${res.status}: ${errorText}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: "GET", token }),

  post: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: "POST", body, token }),

  put: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: "PUT", body, token }),

  patch: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: "PATCH", body, token }),

  delete: <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: "DELETE", token }),
};

export { API_BASE_URL };