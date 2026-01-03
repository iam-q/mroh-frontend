const DEFAULT_API_BASE = "/api";

export const apiBase =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ?? DEFAULT_API_BASE;

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalized}`;
}
