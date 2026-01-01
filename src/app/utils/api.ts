const DEFAULT_API_BASE = "http://localhost:8080";

export const apiBase =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ?? DEFAULT_API_BASE;

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalized}`;
}
