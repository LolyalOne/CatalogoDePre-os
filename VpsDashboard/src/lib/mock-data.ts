import type { SearchFilters, SearchResult, TableInfo } from "./api-types";

export const MOCK_TABLES: TableInfo[] = [
  { id: "censud_totale", label: { it: "Censo Sud Italia", pt: "Censo Sul Itália" }, description: { it: "Censimento macroregione Sud", pt: "Censo macrorregião Sul" }, rowCount: 10_900_000, category: "censo" },
  { id: "nord_totale", label: { it: "Censo Nord Italia", pt: "Censo Norte Itália" }, description: { it: "Censimento macroregione Nord", pt: "Censo macrorregião Norte" }, rowCount: 9_900_000, category: "censo" },
  { id: "aziende_fissi_2025_completo", label: { it: "Aziende · Fissi 2025", pt: "Empresas · Fixos 2025" }, description: { it: "Telefoni fissi aziendali 2025", pt: "Telefones fixos corporativos 2025" }, rowCount: 4_300_000, category: "azienda" },
  { id: "aziende_fissi_2025_pi_cf", label: { it: "Aziende · Fissi + PI/CF", pt: "Empresas · Fixos + PI/CF" }, description: { it: "Fissi con Partita IVA / Codice Fiscale", pt: "Fixos com Partita IVA / Codice Fiscale" }, rowCount: 4_100_000, category: "azienda" },
  { id: "aziende_2023", label: { it: "Aziende 2023", pt: "Empresas 2023" }, description: { it: "Anagrafica generale imprese", pt: "Cadastro geral de empresas" }, rowCount: 3_800_000, category: "azienda" },
  { id: "aziende_cell_tot_glob_verificate_2023", label: { it: "Aziende · Cellulari verificati", pt: "Empresas · Celulares verificados" }, description: { it: "Cellulari aziendali verificati 2023", pt: "Celulares corporativos verificados 2023" }, rowCount: 2_000_000, category: "contatto" },
  { id: "blacklist_email", label: { it: "Blacklist E-mail", pt: "Blacklist E-mail" }, description: { it: "Esclusione regolatoria GDPR / Beppe", pt: "Exclusão regulatória GDPR / Beppe" }, rowCount: 1_900_000, category: "blacklist" },
  { id: "email_privati", label: { it: "E-mail Privati", pt: "E-mails Privados" }, description: { it: "E-mail persone fisiche", pt: "E-mails de pessoas físicas" }, rowCount: 1_400_000, category: "privato" },
  { id: "privati_2023", label: { it: "Privati 2023", pt: "Pessoas Físicas 2023" }, description: { it: "Anagrafica persone fisiche", pt: "Cadastro pessoas físicas" }, rowCount: 340_000, category: "privato" },
  { id: "blacklist_mobile", label: { it: "Blacklist Mobile", pt: "Blacklist Móvel" }, description: { it: "Esclusione mobile", pt: "Exclusão móvel" }, rowCount: 114_000, category: "blacklist" },
  { id: "comuni", label: { it: "Comuni Italia", pt: "Municípios Itália" }, description: { it: "Comuni e province", pt: "Municípios e províncias" }, rowCount: 31_000, category: "geo" },
];

const FIRST = ["Marco", "Giulia", "Francesco", "Sofia", "Alessandro", "Chiara", "Matteo", "Elena", "Lorenzo", "Martina"];
const LAST = ["Rossi", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno"];
const COMPANY = ["Ristorante", "Officina", "Studio", "Farmacia", "Immobiliare", "Consulting", "Trasporti", "Costruzioni", "Boutique", "Caffè"];
const CITIES = [
  { c: "Roma", p: "RM", r: "centro" },
  { c: "Milano", p: "MI", r: "nord" },
  { c: "Napoli", p: "NA", r: "sud" },
  { c: "Torino", p: "TO", r: "nord" },
  { c: "Palermo", p: "PA", r: "sud" },
  { c: "Firenze", p: "FI", r: "centro" },
  { c: "Bologna", p: "BO", r: "nord" },
  { c: "Bari", p: "BA", r: "sud" },
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pad(n: number, len: number) { return String(n).padStart(len, "0"); }

function makeCF(rng: () => number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 6; i++) out += letters[Math.floor(rng() * 26)];
  out += pad(Math.floor(rng() * 100), 2);
  out += letters[Math.floor(rng() * 26)];
  out += pad(Math.floor(rng() * 100), 2);
  out += letters[Math.floor(rng() * 26)];
  out += pad(Math.floor(rng() * 1000), 3);
  out += letters[Math.floor(rng() * 26)];
  return out.slice(0, 16);
}

function makePI(rng: () => number) {
  return pad(Math.floor(rng() * 1e11), 11);
}

const COLUMN_SETS: Record<string, string[]> = {
  azienda: ["ragione_sociale", "partita_iva", "codice_fiscale", "telefono_fisso", "cellulare", "email", "indirizzo", "comune", "provincia", "regione"],
  privato: ["nome", "cognome", "codice_fiscale", "cellulare", "email", "indirizzo", "comune", "provincia", "regione"],
  censo: ["nome", "cognome", "codice_fiscale", "indirizzo", "comune", "provincia", "regione", "eta"],
  contatto: ["ragione_sociale", "cellulare", "verificato", "comune", "provincia"],
  blacklist: ["identificatore", "tipo", "data_inserimento"],
  geo: ["comune", "provincia", "regione", "cap", "abitanti"],
};

export function mockSearch(filters: SearchFilters): SearchResult {
  const start = performance.now();
  const tableId = filters.table === "global" ? "aziende_2023" : filters.table;
  const info = MOCK_TABLES.find((t) => t.id === tableId) ?? MOCK_TABLES[0];
  const cols = COLUMN_SETS[info.category] ?? COLUMN_SETS.azienda;

  const seed = [...(filters.q + filters.cf + filters.pi + filters.provincia + tableId)].reduce((a, c) => a + c.charCodeAt(0), 1);
  const rng = seedRand(seed || 1);

  // Simulate total based on filter tightness
  let total = Math.floor(info.rowCount * (filters.q || filters.cf || filters.pi ? 0.0005 : 0.02));
  if (filters.provincia) total = Math.floor(total * 0.4);
  if (filters.blacklist) total = Math.floor(total * 0.85);
  if (filters.mode === "fuzzy" && filters.q) total = Math.floor(total * 2.5);
  total = Math.max(0, Math.min(total, 250_000));

  const pageRows = Math.min(filters.pageSize, Math.max(0, total - (filters.page - 1) * filters.pageSize));
  const rows: Array<Record<string, string | number | null>> = [];

  for (let i = 0; i < pageRows; i++) {
    const city = CITIES[Math.floor(rng() * CITIES.length)];
    const row: Record<string, string | number | null> = {};
    for (const col of cols) {
      switch (col) {
        case "ragione_sociale":
          row[col] = `${COMPANY[Math.floor(rng() * COMPANY.length)]} ${LAST[Math.floor(rng() * LAST.length)]} S.r.l.`; break;
        case "nome":
          row[col] = FIRST[Math.floor(rng() * FIRST.length)]; break;
        case "cognome":
          row[col] = LAST[Math.floor(rng() * LAST.length)]; break;
        case "codice_fiscale":
          row[col] = filters.cf || makeCF(rng); break;
        case "partita_iva":
          row[col] = filters.pi || makePI(rng); break;
        case "telefono_fisso":
          row[col] = filters.require.fixed || rng() > 0.4 ? `0${city.p === "RM" ? 6 : city.p === "MI" ? 2 : Math.floor(rng() * 900) + 100} ${Math.floor(rng() * 9_000_000) + 1_000_000}` : null; break;
        case "cellulare":
          row[col] = filters.require.mobile || rng() > 0.3 ? `+39 3${Math.floor(rng() * 90) + 10} ${Math.floor(rng() * 9_000_000) + 1_000_000}` : null; break;
        case "email":
          row[col] = filters.require.email || rng() > 0.3 ? `contatto${Math.floor(rng() * 9999)}@${["gmail.com","libero.it","tiscali.it","alice.it","pec.it"][Math.floor(rng()*5)]}` : null; break;
        case "indirizzo":
          row[col] = `Via ${LAST[Math.floor(rng() * LAST.length)]}, ${Math.floor(rng() * 250) + 1}`; break;
        case "comune":
          row[col] = filters.comune || city.c; break;
        case "provincia":
          row[col] = filters.provincia || city.p; break;
        case "regione":
          row[col] = filters.regione || city.r; break;
        case "eta":
          row[col] = Math.floor(rng() * 60) + 18; break;
        case "verificato":
          row[col] = rng() > 0.15 ? "sì" : "no"; break;
        case "identificatore":
          row[col] = rng() > 0.5 ? makeCF(rng) : `+39 3${Math.floor(rng() * 90) + 10}${Math.floor(rng() * 9_000_000) + 1_000_000}`; break;
        case "tipo":
          row[col] = rng() > 0.5 ? "email" : "mobile"; break;
        case "data_inserimento":
          row[col] = `202${Math.floor(rng() * 5)}-${pad(Math.floor(rng() * 12) + 1, 2)}-${pad(Math.floor(rng() * 28) + 1, 2)}`; break;
        case "cap":
          row[col] = pad(Math.floor(rng() * 99999), 5); break;
        case "abitanti":
          row[col] = Math.floor(rng() * 500_000); break;
        default:
          row[col] = null;
      }
    }
    rows.push(row);
  }

  // Fake latency spread
  const elapsed = Math.max(8, Math.round(performance.now() - start) + (filters.table === "global" ? 320 : 40) + Math.floor(rng() * 60));

  return { rows, total, elapsedMs: elapsed, columns: cols };
}
