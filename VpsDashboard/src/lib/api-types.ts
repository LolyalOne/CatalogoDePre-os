export type SearchMode = "exact" | "fuzzy";
export type ExportFormat = "xlsx" | "csv" | "zip";
export type Region = string;

export interface TableInfo {
  id: string;               // technical name, e.g. "aziende_2023"
  label: { it: string; pt: string };
  description: { it: string; pt: string };
  rowCount: number;
  category: "azienda" | "privato" | "censo" | "contatto" | "blacklist" | "geo";
}

export interface SearchFilters {
  table: string;
  target?: string;
  channel?: string;
  ageMin?: number;
  ageMax?: number;
  sesso?: string;
  categoria?: string;            // "global" or a table id
  q: string;
  mode: SearchMode;
  cf: string;
  pi: string;
  comune: string;
  provincia: string;
  regione: Region;
  cap: string;
  require: {
    fixed: boolean;
    mobile: boolean;
    email: boolean;
  };
  blacklist: boolean;       // block blacklisted
  onlyItalians?: boolean;
  suppressList?: string[];  // Anti-duplicidade: lista de contatos do cliente a excluir
  suppressType?: "mobile" | "fixed" | "email" | "cf" | "auto";
  suppressFileName?: string;
  page: number;
  pageSize: number;
}

export interface SearchResult {
  rows: Array<Record<string, string | number | null>>;
  total: number;
  elapsedMs: number;
  columns: string[];        // dynamic
}

export interface ExportJobStart {
  jobId: string;
}

export interface ExportProgress {
  pct: number;              // 0..100
  rowsProcessed: number;
  rowsPerSec: number;
  estimatedBytes?: number;
  downloadUrl?: string;
  error?: string;
}
