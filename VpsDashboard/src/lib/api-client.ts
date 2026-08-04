import type { ExportFormat, ExportJobStart, SearchFilters, SearchResult, TableInfo } from "./api-types";
import { MOCK_TABLES, mockSearch } from "./mock-data";
import { auth } from "./firebase";

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK as string | undefined) !== "false" && !BASE;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  let token = "";
  try {
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }
  } catch (e) {
    console.error("Token error:", e);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchTables(): Promise<TableInfo[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 120));
    return MOCK_TABLES;
  }
  const data = await req<{ tables: TableInfo[] }>("/api/tables");
  return data.tables;
}

export async function fetchComuni(provincia?: string): Promise<{ name: string; prov: string }[]> {
  if (USE_MOCK) {
    return [];
  }
  const query = provincia ? `?provincia=${encodeURIComponent(provincia)}` : "";
  const data = await req<{ comuni: { name: string; prov: string }[] }>(`/api/comuni${query}`);
  return data.comuni;
}


export async function search(filters: SearchFilters): Promise<SearchResult> {
  if (USE_MOCK) {
    // simulate network + query time
    const delay = filters.table === "global" ? 700 + Math.random() * 900 : 180 + Math.random() * 350;
    await new Promise((r) => setTimeout(r, delay));
    return mockSearch(filters);
  }
  return req<SearchResult>("/api/search", { method: "POST", body: JSON.stringify(filters) });
}

export async function startExport(
  filters: SearchFilters,
  format: ExportFormat,
  exportName?: string,
): Promise<ExportJobStart> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    return { jobId: `mock-${format}-${Date.now()}` };
  }
  return req<ExportJobStart>("/api/export", {
    method: "POST",
    body: JSON.stringify({ ...filters, format, ...(exportName ? { exportName } : {}) }),
  });
}

export function exportStatusUrl(jobId: string): string {
  return `${BASE}/api/export/status/${encodeURIComponent(jobId)}`;
}

export function downloadHref(fileName: string): string {
  return `${BASE}/api/download/${encodeURIComponent(fileName)}`;
}
