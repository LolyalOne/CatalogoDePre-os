import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from "react";

export type Lang = "it" | "pt";

const STORAGE_KEY = "ui-lang";

type Dict = Record<string, { it: string; pt: string }>;

export const dict = {
  "app.title": {
    it: "Filtro de Empresa Demo",
    pt: "Filtro de Empresa Demo",
  },
  "app.subtitle": {
    it: "Intelligenza dati aziendali · 34.2M record · Roma DC",
    pt: "Inteligência de dados corporativos · 34,2M registros · Roma DC",
  },
  "nav.dashboard": { it: "Ricerca", pt: "Busca" },
  "nav.export": { it: "Esportazioni", pt: "Exportações" },
  "lang.switch": { it: "Lingua", pt: "Idioma" },

  "section.database": { it: "1. Base Dati", pt: "1. Base de Dados" },
  "section.database.help": {
    it: "Seleziona in quale base dati italiana vuoi effettuare la ricerca. La Ricerca Globale scansiona tutte le basi simultaneamente, mentre la selezione individuale ottimizza la velocità per categorie specifiche come aziende o cittadini.",
    pt: "Selecione em qual base de dados italiana deseja realizar a mineração. A busca global varre todas as bases simultaneamente, enquanto a seleção individual otimiza a velocidade para categorias específicas como empresas ou cidadãos.",
  },
  "table.global": { it: "Ricerca Globale (tutte)", pt: "Busca Global (todas)" },
  "table.global.desc": {
    it: "Cerca in tutte le 11 basi contemporaneamente",
    pt: "Busca em todas as 11 bases simultaneamente",
  },

  "section.text": { it: "2. Ricerca Testuale e Anagrafica", pt: "2. Busca Textual e Cadastral" },
  "section.text.help": {
    it: "Digita il nome della persona, ragione sociale o indirizzo. Attiva la modalità Fonetica per trovare risultati anche in caso di errori di battitura o abbreviazioni.",
    pt: "Digite o nome da pessoa, razão social da empresa ou logradouro. Ative o modo Fonético para encontrar resultados mesmo com erros de digitação ou abreviações.",
  },
  "text.placeholder": {
    it: "Nome, Ragione Sociale, Indirizzo…",
    pt: "Nome, Razão Social, Endereço…",
  },
  "mode.exact": { it: "Esatto", pt: "Exato" },
  "mode.fuzzy": { it: "Flessibile (Fonetico)", pt: "Flexível (Fonético)" },

  "section.fiscal": { it: "3. Filtri Fiscali Italiani", pt: "3. Filtros Fiscais Italianos" },
  "section.fiscal.help": {
    it: "Filtra con precisione tramite gli identificatori ufficiali italiani. Il Codice Fiscale è il documento del cittadino (16 caratteri), mentre la Partita IVA identifica le aziende (11 cifre).",
    pt: "Filtre com precisão através dos identificadores oficiais da Itália. O Codice Fiscale é o documento individual do cidadão (16 caracteres), enquanto a Partita IVA identifica pessoas jurídicas (11 dígitos).",
  },
  "fiscal.cf": { it: "Codice Fiscale (16 caratteri)", pt: "Codice Fiscale (16 caracteres)" },
  "fiscal.pi": { it: "Partita IVA (11 cifre)", pt: "Partita IVA (11 dígitos)" },

  "section.geo": { it: "4. Filtri Geografici", pt: "4. Filtros Geográficos" },
  "section.geo.help": {
    it: "Restringi i risultati per localizzazione geografica. Puoi digitare la sigla della provincia (es. RM, MI, TO) o il nome del comune per isolare contatti di una specifica zona.",
    pt: "Restrinja os resultados por localização geográfica. Você pode digitar a sigla da província (ex: RM, MI, TO) ou o nome do município para isolar contatos de uma região específica.",
  },
  "geo.comune": { it: "Comune / Città", pt: "Município / Cidade" },
  "geo.provincia": { it: "Provincia (es. RM)", pt: "Província (ex: RM)" },
  "geo.region.any": { it: "Tutte le macroregioni", pt: "Todas as macrorregiões" },
  "geo.region.nord": { it: "Nord", pt: "Nord" },
  "geo.region.centro": { it: "Centro", pt: "Centro" },
  "geo.region.sud": { it: "Sud", pt: "Sud" },

  "section.contacts": { it: "5. Contatti & Conformità GDPR", pt: "5. Contatos & Conformidade GDPR" },
  "section.contacts.help": {
    it: "Seleziona quali canali di comunicazione sono obbligatori. Il filtro Blacklist incrocia i dati con le liste di esclusione normativa italiana, rimuovendo i contatti non sollecitabili.",
    pt: "Selecione quais canais de comunicação são obrigatórios no resultado. O filtro Blacklist cruza os dados com as listas de exclusão regulatória italiana, removendo contatos que não podem ser acionados.",
  },
  "contacts.fixed": { it: "Richiedi telefono fisso", pt: "Exigir telefone fixo" },
  "contacts.mobile": { it: "Richiedi cellulare", pt: "Exigir celular" },
  "contacts.email": { it: "Richiedi e-mail", pt: "Exigir e-mail" },
  "contacts.blacklist": { it: "Blocca Blacklist Beppe / GDPR", pt: "Bloquear Blacklist Beppe / GDPR" },

  "cta.search": { it: "Avvia ricerca", pt: "Iniciar busca" },
  "cta.reset": { it: "Azzera filtri", pt: "Limpar filtros" },
  "cta.export": { it: "Esporta risultati", pt: "Exportar resultados" },

  "results.title": { it: "Risultati", pt: "Resultados" },
  "results.empty": { it: "Nessun risultato. Modifica i filtri e riprova.", pt: "Nenhum resultado. Ajuste os filtros e tente novamente." },
  "results.awaiting": { it: "Configura i filtri e avvia la ricerca per iniziare.", pt: "Configure os filtros e inicie a busca para começar." },
  "results.of": { it: "di", pt: "de" },
  "results.rows": { it: "record", pt: "registros" },
  "results.elapsed": { it: "in", pt: "em" },
  "results.page": { it: "Pagina", pt: "Página" },
  "results.prev": { it: "Precedente", pt: "Anterior" },
  "results.next": { it: "Successiva", pt: "Próxima" },
  "results.expand": { it: "Dettagli", pt: "Detalhes" },

  "loading.global": {
    it: "Ricerca in corso su 34.2M di record...",
    pt: "Busca em andamento em 34,2M de registros...",
  },
  "loading.table": {
    it: "Elaborazione ricerca in corso...",
    pt: "Processando consulta na base de dados...",
  },

  "export.title": { it: "Esportazione Big Data", pt: "Exportação Big Data" },
  "export.subtitle": {
    it: "Scegli il formato: il motore parziona automaticamente file oltre 1M righe.",
    pt: "Escolha o formato: o motor particiona automaticamente arquivos acima de 1M linhas.",
  },
  "export.xlsx.title": { it: "Excel Multi-Foglio (.XLSX)", pt: "Excel Multi-Aba (.XLSX)" },
  "export.xlsx.desc": {
    it: "Ideale per report gestionali. Il motore divide automaticamente fogli oltre 1 milione di righe per evitare il blocco di Excel.",
    pt: "Ideal para relatórios gerenciais. Nosso motor divide automaticamente planilhas com mais de 1 milhão de linhas para evitar travamento do Excel.",
  },
  "export.csv.title": { it: "Formato CSV (.CSV)", pt: "Formato CSV (.CSV)" },
  "export.csv.desc": {
    it: "Formato testo standard, compatibile con CRM, dialer automatici e piattaforme di e-mail marketing.",
    pt: "Formato texto padrão, compatível com CRM, discadores automáticos e plataformas de e-mail marketing.",
  },
  "export.zip.title": { it: "Archivio Compresso (.ZIP)", pt: "Arquivo Compactado (.ZIP)" },
  "export.zip.desc": {
    it: "Compressione ottimizzata per il download di volumi elevati di dati. Riduce lo spazio di archiviação.",
    pt: "Compactação otimizada para download de grandes volumes de dados. Reduz o tamanho do arquivo.",
  },
  "export.start": { it: "Genera archivio", pt: "Gerar arquivo" },
  "export.processed": { it: "Righe elaborate", pt: "Linhas processadas" },
  "export.speed": { it: "Velocità", pt: "Velocidade" },
  "export.elapsed": { it: "Tempo trascorso", pt: "Tempo decorrido" },
  "export.download": { it: "Scarica archivio", pt: "Baixar arquivo" },
  "export.reconnecting": { it: "Riconnessione al flusso…", pt: "Reconectando ao fluxo…" },
  "export.size.estimated": { it: "Dimensione stimata", pt: "Tamanho estimado" },

  "banner.mock.title": { it: "Modalità Demo", pt: "Modo Demo" },
  "banner.mock.body": {
    it: "L'UI sta usando dati simulati. Imposta VITE_API_BASE_URL e disattiva VITE_USE_MOCK per collegare l'API FastAPI su api.exemplo.com.",
    pt: "A UI está usando dados simulados. Defina VITE_API_BASE_URL e desative VITE_USE_MOCK para conectar na API FastAPI em api.exemplo.com.",
  },
  "error.generic": { it: "Errore nella richiesta.", pt: "Erro na requisição." },
  "geo.scope.label": { it: "Ambito Geografico di Ricerca", pt: "Escopo Geográfico de Busca" },
  "geo.scope.nazionale": { it: "Selezione Nazionale (Tutta Italia)", pt: "Seleção Nacional (Toda Itália)" },
  "geo.scope.regioni": { it: "Selezione per Regioni", pt: "Seleção por Região" },
  "geo.scope.provincia": { it: "Selezione per Provincia", pt: "Seleção por Província" },
  "geo.scope.citta": { it: "Selezione per Città / Comune", pt: "Seleção por Cidade / Município" },
  "geo.scope.cap": { it: "Selezione per CAP (Codice Avviamento Postale)", pt: "Seleção por CEP (Código Postal)" },

  "geo.cap.label": { it: "Codice di Avviamento Postale (CAP)", pt: "Código Postal (CAP / CEP)" },
  "geo.cap.placeholder": { it: "es. 00100, 20100, 80100...", pt: "ex. 00100, 20100, 80100..." },
  "geo.citta.label": { it: "Città / Comune (Autocompletamento)", pt: "Cidade / Município (Autocompletar)" },
  "geo.citta.placeholder": { it: "es. Roma, Milano, Napoli, Torino...", pt: "ex. Roma, Milano, Napoli, Torino..." },
  "geo.provincia.label": { it: "Sigla Provincia (2 Lettere)", pt: "Sigla da Província (2 Letras)" },
  "geo.provincia.placeholder": { it: "es. RM, MI, NA, TO, FI, BO...", pt: "ex. RM, MI, NA, TO, FI, BO..." },
  "geo.regioni.label": { it: "Seleziona Regione / Macroregione", pt: "Selecione Região / Macrorregião" },

  "geo.reg.nord": { it: "Nord Italia", pt: "Norte da Itália" },
  "geo.reg.centro": { it: "Centro Italia", pt: "Centro da Itália" },
  "geo.reg.sud": { it: "Sud e Isole", pt: "Sul e Ilhas" },
  "geo.reg.lombardia": { it: "Lombardia (MI, BG, BS...)", pt: "Lombardia (MI, BG, BS...)" },
  "geo.reg.lazio": { it: "Lazio (RM, LT, FR...)", pt: "Lácio (RM, LT, FR...)" },
  "geo.reg.veneto": { it: "Veneto (VE, VR, PD...)", pt: "Vêneto (VE, VR, PD...)" },
  "geo.reg.campania": { it: "Campania (NA, SA, CE...)", pt: "Campânia (NA, SA, CE...)" },
  "geo.reg.emilia": { it: "Emilia-Romagna (BO, MO...)", pt: "Emília-Romanha (BO, MO...)" },
  "geo.reg.piemonte": { it: "Piemonte (TO, CN...)", pt: "Piemonte (TO, CN...)" },
  "geo.reg.sicilia": { it: "Sicilia (PA, CT, ME...)", pt: "Sicília (PA, CT, ME...)" },
  "geo.reg.puglia": { it: "Puglia (BA, LE, FG...)", pt: "Puglia (BA, LE, FG...)" },
  "geo.reg.toscana": { it: "Toscana (FI, PI, LI...)", pt: "Toscana (FI, PI, LI...)" },
  "geo.reg.calabria": { it: "Calabria (RC, CS, CZ...)", pt: "Calábria (RC, CS, CZ...)" },
  "geo.reg.sardegna": { it: "Sardegna (CA, SS...)", pt: "Sardenha (CA, SS...)" },

  "ui.filters.advanced": { it: "Filtri Avanzati (Fiscali, Geografici, Contatti)", pt: "Filtros Avançados (Fiscais, Geográficos, Contatos)" },
  "ui.hero.badge": { it: "Piattaforma di Gestione Dati · Demo Inc.", pt: "Plataforma de Gestão de Dados · Demo Inc." },
  "ui.hero.search_label": { it: "Ricerca Anagrafica e Territoriale", pt: "Busca Cadastral e Territorial" },
  "ui.hero.search_placeholder": { it: "Cerca per Nome, Azienda, Indirizzo, Codice Fiscale, P.IVA o Telefono...", pt: "Busque por Nome, Empresa, Endereço, CPF, CNPJ ou Telefone..." },
  "ui.export_center.btn": { it: "Centro Esportazioni & Telemetria", pt: "Central de Exportação & Telemetria" },
  "ui.blacklist.btn": { it: "Gestione Blacklist / Database", pt: "Gestão de Blacklist / Banco de Dados" },
  "ui.shield.mandatory": { it: "Protezione Legale Attiva · Rimozione automatica delle ~2M righe di esclusione GDPR.", pt: "Proteção Legal Ativa · Remoção automática das ~2M linhas de exclusão GDPR." },

  "ui.blacklist.badge": { it: "Blacklist GDPR Obbligatoria Attiva", pt: "Blacklist GDPR Obrigatória Ativa" },
  "ui.export.btn": { it: "Pannello Esportazione Big Data", pt: "Painel de Exportação Big Data" },
  "contacts.blacklist.title": { it: "Filtro Blacklist & Privacy GDPR", pt: "Filtro Blacklist & Privacidade GDPR" },
  "contacts.blacklist.badge": { it: "OBBLIGATORIO", pt: "OBRIGATÓRIO" },
  "contacts.blacklist.desc": {
    it: "Il blocco dei contatti in blacklist è sempre attivo su tutti i database per conformità di legge.",
    pt: "O bloqueio de contatos na blacklist está sempre ativo em todos os bancos de dados por conformidade legal.",
  },
  "contacts.blacklist.btn": { it: "Gestione Blacklist", pt: "Gestão de Blacklist" },

  "blacklist.modal.title": { it: "Gestione Blacklist & Conformità Database", pt: "Gestão de Blacklist & Conformidade do Banco" },
  "blacklist.modal.subtitle": {
    it: "Il blocco Blacklist è OBBLIGATORIO e SEMPRE ATTIVO per tutti i 34.2M di record. Nessuna informazione protetta viene mostrata.",
    pt: "O bloqueio Blacklist é OBRIGATÓRIO e SEMPRE ATIVO para todos os 34,2M de registros. Nenhuma informação protegida é exibida.",
  },
  "blacklist.modal.tab.rules": { it: "Regole Blacklist", pt: "Regras da Blacklist" },
  "blacklist.modal.tab.db": { it: "Stato Protezione Database (34.2M)", pt: "Status de Proteção dos Bancos (34,2M)" },
  "blacklist.modal.add.btn": { it: "Aggiungi Nuova Regola alla Blacklist Globale", pt: "Adicionar Nova Regra à Blacklist Global" },
  "blacklist.modal.type": { it: "Tipo di Blocco", pt: "Tipo de Bloqueio" },
  "blacklist.modal.value": { it: "Valore da Bloccare", pt: "Valor para Bloquear" },
  "blacklist.modal.reason": { it: "Motivo / Note Legali GDPR", pt: "Motivo / Notas Legais GDPR" },
  "blacklist.modal.reason.ph": { it: "Motivo del blocco o riferimento pratica GDPR (opzionale)...", pt: "Motivo do bloqueio ou referência do processo GDPR (opcional)..." },
  "blacklist.modal.submit": { it: "Salva Regola", pt: "Salvar Regra" },
  "blacklist.modal.success": { it: "Regola di blocco aggiunta con successo e applicata all'indice globale!", pt: "Regra de bloqueio adicionada com sucesso e aplicada ao índice global!" },
  "blacklist.modal.th.type": { it: "Tipo", pt: "Tipo" },
  "blacklist.modal.th.val": { it: "Valore Bloccato", pt: "Valor Bloqueado" },
  "blacklist.modal.th.reason": { it: "Motivo / Pratica GDPR", pt: "Motivo / Processo GDPR" },
  "blacklist.modal.th.date": { it: "Data", pt: "Data" },
  "blacklist.modal.th.action": { it: "Azione", pt: "Ação" },
  "blacklist.modal.alert": {
    it: "Tutte le 11 basi dati italiane sono costantemente monitorate dal filtro Blacklist e dai criteri di privacy GDPR della piattaforma",
    pt: "Todos os 11 bancos de dados italianos são constantemente monitorados pelo filtro Blacklist e critérios de privacidade GDPR da plataforma",
  },
  "blacklist.modal.footer": {
    it: "Sviluppato e gestito da",
    pt: "Desenvolvido e gerenciado por",
  },
  "blacklist.modal.close": { it: "Chiudi Finestra", pt: "Fechar Janela" },

  "geo.bar.title": { it: "Localizzazione Geografica Italia (Comuni, Province, Regioni & CAP)", pt: "Localização Geográfica Itália (Municípios, Províncias, Regiões e CEP)" },
  "geo.bar.subtitle": { it: "Filtro Geografico e Territoriale", pt: "Filtro Geográfico e Territorial" },
  "geo.bar.desc": { it: "Selezione territoriale per regione, provincia, comune o codice di avviamento postale.", pt: "Seleção territorial por região, província, município ou código postal." },
  "geo.reset": { it: "Azzera filtri geografici", pt: "Limpar filtros geográficos" },
  "geo.active": { it: "FILTRO ATTIVO", pt: "FILTRO ATIVO" },
  "geo.col.regione": { it: "Regione / Macroregione", pt: "Região / Macrorregião" },
  "geo.col.provincia": { it: "Provincia (107 Province)", pt: "Província (107 Províncias)" },
  "geo.col.comune": { it: "Città / Comune", pt: "Cidade / Município" },
  "geo.col.cap": { it: "CAP (Codice Postale)", pt: "CAP (Código Postal)" },

  "suppression.section.title": {
    it: "4. Anti-Duplicazione / Esclusione Liste Clienti (Carica Excel o CSV Senza Limiti)",
    pt: "4. Anti-Duplicidade / Supressão de Clientes (Exclusão Sem Limites via Excel/CSV)",
  },
  "suppression.section.badge": {
    it: "⚡ Filtro Esclusione Illimitato Attivo",
    pt: "⚡ Filtro Excludente Sem Limites Ativo",
  },
  "suppression.section.desc": {
    it: "Carica il file Excel o CSV con quantità illimitata di contatti che il cliente possiede già. Il sistema li escluderà automaticamente dalla ricerca e dall'esportazione.",
    pt: "Anexe a planilha Excel ou CSV com quantidade ilimitada de contatos que o cliente já possui para que o sistema remova automaticamente esses registros da busca e da exportação.",
  },
  "suppression.shortcut": {
    it: "📤 Anti-Duplicazione (Excel/CSV Senza Limiti)",
    pt: "📤 Anti-Duplicidade (Excel/CSV Sem Limites)",
  },
  "suppression.drop.title": {
    it: "Trascina qui il file Excel o CSV illimitato del cliente oppure ",
    pt: "Arraste a planilha sem limites de quantidade aqui ou ",
  },
  "suppression.drop.browse": {
    it: "seleziona dal computer",
    pt: "selecione do computador",
  },
  "suppression.drop.sub": {
    it: "Supporta .xlsx, .csv, .txt senza limiti di righe o quantità (telefoni, email o CF/P.IVA). Elaborazione istantanea ad altissima velocità.",
    pt: "Suporta .xlsx, .csv, .txt sem limite de quantidade ou linhas (telefones, e-mails ou CPF/CNPJ). Processamento ultrarrápido sem limites.",
  },
} satisfies Dict;

export type TKey = keyof typeof dict;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "it" || saved === "pt") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (k: any) => (dict as any)[k]?.[lang] ?? undefined;

  return createElement(Ctx.Provider, { value: { lang, setLang, t } }, children);
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used inside I18nProvider");
  return ctx;
}
