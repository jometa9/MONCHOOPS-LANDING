import type { SessionSnapshot } from "@/components/landing/window-demo-app/types/session";
import type {
  AccountPublic,
  AccountStatus,
  JobKind,
  JobPublic,
  JobStatus,
  LeadCategoryPublic,
  LeadPublic,
  MassDmInteractionsConfig,
  MassDmResultPublic,
  MassDmSendPublic,
  MessageVariantGroupPublic,
  ScrapeKind,
  ScrapeResultPublic,
  ScrapeUsernameRow,
} from "@/components/landing/window-demo-app/types/domain";

type Unsubscribe = () => void;

export interface BulkLoginRow {
  username: string;
  password: string;
  proxyUrl?: string;
  proxyUsername?: string;
  proxyPassword?: string;
}

export interface ProxyInput {
  url: string;
  username?: string | null;
  password?: string | null;
}

export interface AccountsApi {
  list(): Promise<AccountPublic[]>;
  get(id: string): Promise<AccountPublic | null>;
  startLogin(proxy?: ProxyInput): Promise<{ jobId: string }>;
  startAutoLogin(
    username: string,
    password: string,
    proxy?: ProxyInput
  ): Promise<{ jobId: string }>;
  retryLogin(id: string, password?: string | null): Promise<{ jobId: string }>;
  startBulkAutoLogin(rows: BulkLoginRow[]): Promise<{ jobId: string }>;
  delete(id: string): Promise<void>;
  updateProxy(payload: {
    id: string;
    url: string | null;
    username: string | null;
    password: string | null;
    enabled?: boolean;
  }): Promise<AccountPublic>;
  onChange(cb: () => void): Unsubscribe;
}

export interface JobsApi {
  list(): Promise<JobPublic[]>;
  listRunning(): Promise<JobPublic[]>;
  listActive(): Promise<JobPublic[]>;
  cancel(jobId: string): Promise<void>;
  startMassDm(payload: {
    accountId: string;
    usernamesCsvPath: string;
    messages: string[];
    intervalMs: number;
    interactions?: MassDmInteractionsConfig | null;
    excludeUsernames?: string[] | null;
  }): Promise<string>;
  startScrape(payload: {
    accountId: string;
    kind: ScrapeKind;
    params: Record<string, unknown>;
  }): Promise<string>;
  onChange(cb: () => void): Unsubscribe;
  onProgress(
    cb: (evt: { jobId: string; done: number; total: number | null; item?: string }) => void
  ): Unsubscribe;
  onDone(cb: (evt: { jobId: string; status: string }) => void): Unsubscribe;
  onAccountDrained(cb: (evt: { accountId: string; status: string }) => void): Unsubscribe;
  onLoginFinished(cb: (evt: { jobId: string; status: string }) => void): Unsubscribe;
}

export interface ScrapesApi {
  list(): Promise<ScrapeResultPublic[]>;
  get(jobId: string): Promise<ScrapeResultPublic | null>;
  listUsernames(jobId: string): Promise<ScrapeUsernameRow[]>;
  download(jobId: string): Promise<string | null>;
  revealInFolder(jobId: string): Promise<void>;
}

export interface MassDmsApi {
  list(): Promise<MassDmResultPublic[]>;
  get(jobId: string): Promise<MassDmResultPublic | null>;
  listSends(jobId: string): Promise<MassDmSendPublic[]>;
  listDmedUsernames(accountId: string): Promise<string[]>;
}

export interface CategoriesApi {
  list(): Promise<LeadCategoryPublic[]>;
  create(name: string): Promise<LeadCategoryPublic>;
  rename(id: string, name: string): Promise<LeadCategoryPublic>;
  delete(id: string): Promise<void>;
  listLeads(payload: {
    categoryId: string;
    limit?: number;
    offset?: number;
  }): Promise<LeadPublic[]>;
  exportCsv(categoryId: string): Promise<string | null>;
  onChange(cb: () => void): Unsubscribe;
}

export interface MessageVariantsApi {
  list(): Promise<MessageVariantGroupPublic[]>;
  create(payload: { name: string; variants: string[] }): Promise<MessageVariantGroupPublic>;
  update(payload: {
    id: string;
    name: string;
    variants: string[];
  }): Promise<MessageVariantGroupPublic>;
  delete(id: string): Promise<void>;
  onChange(cb: () => void): Unsubscribe;
}

export interface CsvApi {
  pickAndPersist(): Promise<{ path: string; count: number } | null>;
  persistFromPath(srcPath: string): Promise<{ path: string; count: number }>;
  listUsernames(csvPath: string): Promise<string[]>;
  persistFromUsernames(usernames: string[]): Promise<{ path: string; count: number }>;
  persistFromCategory(categoryId: string): Promise<{ path: string; count: number }>;
  persistFromCategories(categoryIds: string[]): Promise<{ path: string; count: number }>;
  persistFromScrape(jobId: string): Promise<{ path: string; count: number }>;
  persistFromScrapes(jobIds: string[]): Promise<{ path: string; count: number }>;
}

export interface StatsApi {
  get(): Promise<{
    totalJobs: number;
    totalLeads: number;
    totalMessages: number;
    timeSavedMs: number;
  }>;
}

export type UpdateStatus =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "available"; version: string }
  | {
      kind: "downloading";
      version: string;
      percent: number;
      bytesPerSecond: number;
      transferred: number;
      total: number;
    }
  | { kind: "downloaded"; version: string }
  | { kind: "not-available" }
  | { kind: "error"; message: string };

export interface UpdaterApi {
  getState(): Promise<UpdateStatus>;
  checkForUpdates(): Promise<void>;
  installAndRestart(): Promise<void>;
  onStateChange(cb: (state: UpdateStatus) => void): Unsubscribe;
}

export interface BridgeStatus {
  running: boolean;
  port: number | null;
  pairedCount: number;
}

export interface BridgePairRequest {
  pairingId: string;
  code: string;
  name: string;
}

export interface BridgePairedClient {
  id: string;
  name: string;
  createdAt: number;
  lastSeenAt: number;
}

export interface BridgeApi {
  getStatus(): Promise<BridgeStatus>;
  listPaired(): Promise<BridgePairedClient[]>;
  revoke(id: string): Promise<void>;
  resolvePairing(pairingId: string, accept: boolean): Promise<{ ok: boolean }>;
  onPairRequest(cb: (req: BridgePairRequest) => void): Unsubscribe;
  onChange(cb: () => void): Unsubscribe;
}

export interface SettingsApi {
  refreshSession(): Promise<SessionSnapshot>;
  deleteAllAccounts(): Promise<void>;
  deleteAllScrapes(): Promise<void>;
  selectDirectory(): Promise<string | null>;
  getAppVersion(): Promise<string>;
  wipeAllData(): Promise<void>;
  getScrapeExportDir(): Promise<string>;
  setScrapeExportDir(dir: string): Promise<void>;
  getHeadless(): Promise<boolean>;
  setHeadless(headless: boolean): Promise<void>;
  getFullWindow(): Promise<boolean>;
  setFullWindow(full: boolean): Promise<void>;
}

export interface B2dmApi {
  getPlatform(): Promise<NodeJS.Platform>;
  getIsFullScreen(): Promise<boolean>;
  onFullScreenChange(cb: (isFullScreen: boolean) => void): Unsubscribe;
  setWindowButtonPosition(x: number | null, y: number | null): Promise<void>;
  openExternalLink(url: string): Promise<void>;
  onSystemSuspend(cb: () => void): Unsubscribe;
  onSystemResume(cb: () => void): Unsubscribe;
  onPrepareQuit(cb: () => void): Unsubscribe;
  quitReady(): void;
  onNavigateToSettings(cb: () => void): Unsubscribe;
  onDeepLink(cb: (data: { url: string }) => void): Unsubscribe;
  getPendingDeepLink(): Promise<string | null>;
  clearPendingDeepLink(url: string): Promise<void>;
  getSession(): Promise<SessionSnapshot>;
  validateLicense(licenseKey: string): Promise<SessionSnapshot>;
  logout(): Promise<void>;
  onSessionChange(cb: (snapshot: SessionSnapshot) => void): Unsubscribe;
  accounts: AccountsApi;
  jobs: JobsApi;
  scrapes: ScrapesApi;
  massDms: MassDmsApi;
  categories: CategoriesApi;
  messageVariants: MessageVariantsApi;
  csv: CsvApi;
  settings: SettingsApi;
  stats: StatsApi;
  updater: UpdaterApi;
  bridge: BridgeApi;
}

// ── Mock data store ─────────────────────────────────────────────────────────

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function ago(ms: number): number {
  return NOW - ms;
}

class Emitter<T = void> {
  private subs = new Set<(arg: T) => void>();
  on(cb: (arg: T) => void): Unsubscribe {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  }
  emit(arg: T) {
    this.subs.forEach((cb) => {
      try {
        cb(arg);
      } catch {}
    });
  }
}

const FAKE_USERNAMES = [
  "laura.builds", "kevin.devshop", "noora.eats.ny", "octavio.studio",
  "maite.builds.it", "sebasf.dev", "elena.makes", "tomi.creates",
  "ariadna.codes", "felipe.craft", "ines.studio", "renata.works",
  "diego.inc", "juliana.shop", "matias.run", "carolina.lab",
  "santi.dev.studio", "luana.makes", "joaco.builds", "ana.market",
  "pablo.tech", "celes.studio", "nico.craft", "emma.works",
  "leon.ux", "valentina.io", "ramiro.lab", "soledad.market",
  "agus.studio", "francis.tech", "milena.craft", "tobias.dev",
  "camila.works", "ivan.market", "lucia.studio", "rodrigo.lab",
  "sofia.craft", "andres.tech", "isabella.io", "gonzalo.lab",
];

function pickUsername(i: number): string {
  return FAKE_USERNAMES[i % FAKE_USERNAMES.length];
}

const DEFAULT_SESSION: SessionSnapshot = {
  hasLicense: true,
  profile: { email: "joaquin@monchoops.com", name: "Joaquin Metayer" },
  subscription: {
    plan: "Growth",
    active: true,
    version: "1.0.0",
    accountLimit: 10,
    dmMonthlyLimit: 30000,
    accountUsage: 5,
    dmUsage: 12847,
  },
};

let session: SessionSnapshot = DEFAULT_SESSION;
const sessionEmitter = new Emitter<SessionSnapshot>();

const accounts: AccountPublic[] = [
  {
    id: "acc_1",
    username: "monchoops.studio",
    displayName: "MonchoOps Studio",
    profilePicUrl: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    proxyUrl: "http://us-residential-1.proxy:8080",
    proxyUsername: "monchoops",
    proxyEnabled: true,
    hasProxyPassword: true,
    hasStoredPassword: true,
    status: "busy",
    lastError: null,
    createdAt: ago(45 * DAY),
    updatedAt: ago(2 * MIN),
  },
  {
    id: "acc_2",
    username: "growth.lab.io",
    displayName: "Growth Lab",
    profilePicUrl: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    proxyUrl: "http://br-mobile-3.proxy:8080",
    proxyUsername: "growth",
    proxyEnabled: true,
    hasProxyPassword: true,
    hasStoredPassword: true,
    status: "busy",
    lastError: null,
    createdAt: ago(38 * DAY),
    updatedAt: ago(1 * MIN),
  },
  {
    id: "acc_3",
    username: "buenosaires.tech",
    displayName: "Buenos Aires Tech",
    profilePicUrl: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    proxyUrl: "http://ar-residential-2.proxy:8080",
    proxyUsername: "ba",
    proxyEnabled: true,
    hasProxyPassword: true,
    hasStoredPassword: true,
    status: "idle",
    lastError: null,
    createdAt: ago(30 * DAY),
    updatedAt: ago(12 * MIN),
  },
  {
    id: "acc_4",
    username: "moncho.creators",
    displayName: "Moncho Creators",
    profilePicUrl: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    proxyUrl: "http://us-residential-7.proxy:8080",
    proxyUsername: "moncho",
    proxyEnabled: true,
    hasProxyPassword: true,
    hasStoredPassword: true,
    status: "idle",
    lastError: null,
    createdAt: ago(22 * DAY),
    updatedAt: ago(5 * MIN),
  },
  {
    id: "acc_5",
    username: "yoga.studios.ny",
    displayName: "Yoga Studios NY",
    profilePicUrl: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    proxyUrl: "http://us-residential-1.proxy:8080",
    proxyUsername: "yoga",
    proxyEnabled: true,
    hasProxyPassword: true,
    hasStoredPassword: true,
    status: "busy",
    lastError: null,
    createdAt: ago(15 * DAY),
    updatedAt: ago(30_000),
  },
];
const accountsEmitter = new Emitter();

// Categories
const categories: LeadCategoryPublic[] = [
  {
    id: "cat_1",
    name: "Tech Founders LATAM",
    createdAt: ago(40 * DAY),
    updatedAt: ago(3 * DAY),
    leadCount: 1284,
    scrapeCount: 6,
    lastActivityAt: ago(3 * DAY),
  },
  {
    id: "cat_2",
    name: "Yoga Studios — NYC",
    createdAt: ago(20 * DAY),
    updatedAt: ago(1 * DAY),
    leadCount: 412,
    scrapeCount: 3,
    lastActivityAt: ago(1 * DAY),
  },
  {
    id: "cat_3",
    name: "SaaS Founders US",
    createdAt: ago(28 * DAY),
    updatedAt: ago(2 * DAY),
    leadCount: 2840,
    scrapeCount: 8,
    lastActivityAt: ago(2 * DAY),
  },
  {
    id: "cat_4",
    name: "Indie Hackers",
    createdAt: ago(60 * DAY),
    updatedAt: ago(5 * DAY),
    leadCount: 920,
    scrapeCount: 5,
    lastActivityAt: ago(5 * DAY),
  },
  {
    id: "cat_5",
    name: "DTC Founders",
    createdAt: ago(12 * DAY),
    updatedAt: ago(6 * HOUR),
    leadCount: 318,
    scrapeCount: 2,
    lastActivityAt: ago(6 * HOUR),
  },
  {
    id: "cat_6",
    name: "AI / ML Builders",
    createdAt: ago(50 * DAY),
    updatedAt: ago(4 * DAY),
    leadCount: 1640,
    scrapeCount: 7,
    lastActivityAt: ago(4 * DAY),
  },
];
const categoriesEmitter = new Emitter();

function leadsForCategory(catId: string): LeadPublic[] {
  const cat = categories.find((c) => c.id === catId);
  if (!cat) return [];
  const total = Math.min(cat.leadCount, 200);
  const out: LeadPublic[] = [];
  for (let i = 0; i < total; i++) {
    out.push({
      id: i + 1,
      categoryId: catId,
      username: pickUsername(i),
      sourceKind: "scrape_by_username",
      sourceJobId: null,
      sourceDetail: "from @founder_brunch",
      scrapedAt: ago((i + 1) * 2 * HOUR),
    });
  }
  return out;
}

// Variants
const variants: MessageVariantGroupPublic[] = [
  {
    id: "var_1",
    name: "Tech Founders Pitch",
    variants: [
      "Hey {firstName}, saw your post on shipping at scale — would love to share what we learned at MonchoOps about safe outbound on IG. open to a quick chat?",
      "Hey {firstName}, your last post on CAC really nailed it. We help founders run cold IG DMs without getting accounts nuked. interested in a 5-min walkthrough?",
      "Hi {firstName}, fellow LATAM builder here. quick q — how are you doing outbound on IG without burning accounts? we built a tool for exactly that.",
    ],
    createdAt: ago(35 * DAY),
    updatedAt: ago(2 * DAY),
  },
  {
    id: "var_2",
    name: "DTC Outreach",
    variants: [
      "Hi {firstName}! Loved your latest drop. Quick one — are you using IG DMs for retention? we run safe automated outreach for DTC brands.",
      "Hey {firstName}, your packaging is gorgeous. would you be open to chatting about IG DM strategy that doesn't get flagged?",
    ],
    createdAt: ago(20 * DAY),
    updatedAt: ago(7 * DAY),
  },
  {
    id: "var_3",
    name: "Yoga Studio NYC",
    variants: [
      "Hey {firstName} — local NYC studio here, would love to compare notes on filling weekday classes. open to chat?",
      "Hi {firstName}, fellow Brooklyn studio owner. how are you handling member outreach? happy to share what's working for us.",
    ],
    createdAt: ago(18 * DAY),
    updatedAt: ago(4 * DAY),
  },
  {
    id: "var_4",
    name: "SaaS Cold Open",
    variants: [
      "Hey {firstName}, I help SaaS founders run safe IG outbound. saw your post on activation — would love to share what's working.",
      "Hi {firstName}, your thread on PMF was 🔥. quick q — how are you currently running founder-led outreach?",
    ],
    createdAt: ago(50 * DAY),
    updatedAt: ago(10 * DAY),
  },
  {
    id: "var_5",
    name: "Indie Builders",
    variants: [
      "Hey {firstName}, fellow indie hacker. just shipped a tool that runs IG outbound locally (no cloud sessions). want a peek?",
    ],
    createdAt: ago(45 * DAY),
    updatedAt: ago(12 * DAY),
  },
  {
    id: "var_6",
    name: "AI Builders Outreach",
    variants: [
      "Hey {firstName}, saw your latest demo — slick. we're building tools for AI founders to do safe IG outbound, would love your take.",
      "Hi {firstName}, fellow AI builder. quick one — are you running founder-led outbound on IG? we'd love to show you our flow.",
    ],
    createdAt: ago(15 * DAY),
    updatedAt: ago(2 * DAY),
  },
];
const variantsEmitter = new Emitter();

// Scrapes
const scrapeKinds: ScrapeKind[] = [
  "scrape_by_username",
  "scrape_by_post",
  "scrape_by_hashtag",
  "scrape_by_location",
];

const scrapes: ScrapeResultPublic[] = Array.from({ length: 14 }).map((_, i) => {
  const kind = scrapeKinds[i % scrapeKinds.length];
  const acc = accounts[i % accounts.length];
  const cat = categories[i % categories.length];
  const target =
    kind === "scrape_by_hashtag"
      ? `#${["saas", "indiehacker", "dtc", "yoga", "ai"][i % 5]}`
      : kind === "scrape_by_location"
        ? ["New York, NY", "San Francisco, CA", "Buenos Aires", "Mexico City"][i % 4]
        : `@${pickUsername(i)}`;
  const usernameCount = 200 + Math.floor(Math.random() * 1200);
  return {
    jobId: `scrape_${i + 1}`,
    kind,
    summary:
      kind === "scrape_by_username"
        ? `Followers of ${target}`
        : kind === "scrape_by_post"
          ? `Likers of post by ${target}`
          : kind === "scrape_by_hashtag"
            ? `Posts tagged ${target}`
            : `Posts in ${target}`,
    usernameCount,
    csvPath: `/exports/scrape_${i + 1}.csv`,
    durationMs: (5 + i) * MIN,
    completedAt: ago((i + 1) * 8 * HOUR),
    categoryId: cat.id,
    categoryName: cat.name,
    status: "completed",
    error: null,
    accountId: acc.id,
    accountUsername: acc.username,
    params: { target },
    targetName: target,
  };
});

// Mass DM history
const massDms: MassDmResultPublic[] = Array.from({ length: 11 }).map((_, i) => {
  const acc = accounts[i % accounts.length];
  const total = 150 + Math.floor(Math.random() * 600);
  const sent = total - Math.floor(Math.random() * 12);
  const failed = total - sent;
  return {
    jobId: `mdm_${i + 1}`,
    accountId: acc.id,
    accountUsername: acc.username,
    accountProfilePicUrl: null,
    sentCount: sent,
    failedCount: failed,
    totalCount: total,
    durationMs: (40 + i * 7) * MIN,
    completedAt: ago((i + 1) * 12 * HOUR),
  };
});

function massDmSendsFor(jobId: string): MassDmSendPublic[] {
  const result = massDms.find((m) => m.jobId === jobId);
  if (!result) return [];
  const out: MassDmSendPublic[] = [];
  for (let i = 0; i < Math.min(result.totalCount, 80); i++) {
    const isFail = i % 23 === 0;
    out.push({
      jobId,
      accountId: result.accountId,
      username: pickUsername(i + 7),
      status: isFail ? "failed" : "sent",
      message: "Hey {firstName}, saw your post — would love to chat 5 min about safe outbound.",
      error: isFail ? "User does not accept DMs from new contacts" : null,
      sentAt: result.completedAt - i * 50_000,
    });
  }
  return out;
}

// Active jobs (running + queued) — kept ticking by an internal interval so the
// demo feels alive.
interface MutableJob extends JobPublic {
  // for queued jobs, when they should start (relative)
  _startAt?: number;
}

const jobs: MutableJob[] = [
  {
    id: "job_1",
    accountId: "acc_1",
    kind: "mass_dm",
    params: { campaignName: "Tech Founders LATAM" },
    status: "running",
    startedAt: ago(8 * MIN),
    runningAt: ago(8 * MIN),
    endedAt: null,
    progressDone: 184,
    progressTotal: 320,
    error: null,
  },
  {
    id: "job_2",
    accountId: "acc_2",
    kind: "scrape_by_hashtag",
    params: { hashtag: "saas" },
    status: "running",
    startedAt: ago(12 * MIN),
    runningAt: ago(12 * MIN),
    endedAt: null,
    progressDone: 412,
    progressTotal: 800,
    error: null,
  },
  {
    id: "job_3",
    accountId: "acc_5",
    kind: "mass_dm",
    params: { campaignName: "Yoga Studios — NYC" },
    status: "running",
    startedAt: ago(2 * MIN),
    runningAt: ago(2 * MIN),
    endedAt: null,
    progressDone: 18,
    progressTotal: 220,
    error: null,
  },
  {
    id: "job_4",
    accountId: "acc_4",
    kind: "scrape_by_username",
    params: { username: "founder_brunch" },
    status: "queued",
    startedAt: ago(0),
    runningAt: null,
    endedAt: null,
    progressDone: 0,
    progressTotal: null,
    error: null,
  },
];

const jobsEmitter = new Emitter();
const jobProgressEmitter = new Emitter<{
  jobId: string;
  done: number;
  total: number | null;
  item?: string;
}>();
const jobDoneEmitter = new Emitter<{ jobId: string; status: string }>();
const accountDrainedEmitter = new Emitter<{ accountId: string; status: string }>();
const loginFinishedEmitter = new Emitter<{ jobId: string; status: string }>();

// Tick: every 2s advance running jobs, occasionally finish one and start the next.
let tickStarted = false;
function startTick() {
  if (tickStarted || typeof window === "undefined") return;
  tickStarted = true;
  setInterval(() => {
    let changed = false;
    for (const j of jobs) {
      if (j.status !== "running" || j.progressTotal == null) continue;
      const step = j.kind === "mass_dm" ? 1 + Math.floor(Math.random() * 2) : 4 + Math.floor(Math.random() * 8);
      const nextDone = Math.min(j.progressTotal, j.progressDone + step);
      if (nextDone !== j.progressDone) {
        j.progressDone = nextDone;
        jobProgressEmitter.emit({
          jobId: j.id,
          done: nextDone,
          total: j.progressTotal,
          item: pickUsername(nextDone),
        });
        changed = true;
      }
      if (nextDone >= j.progressTotal) {
        // wrap around so the demo loops forever
        j.progressDone = Math.floor(j.progressTotal * 0.1);
        jobProgressEmitter.emit({
          jobId: j.id,
          done: j.progressDone,
          total: j.progressTotal,
        });
      }
    }
    if (changed) jobsEmitter.emit();
  }, 1500);
}

const stats = {
  totalJobs: 142,
  totalLeads: 48210,
  totalMessages: 12847,
  timeSavedMs: 318 * HOUR,
};

// Updater
let updateState: UpdateStatus = { kind: "idle" };
const updateEmitter = new Emitter<UpdateStatus>();

// Bridge
const bridgeStatus: BridgeStatus = { running: true, port: 7775, pairedCount: 1 };
const pairedClients: BridgePairedClient[] = [
  {
    id: "bridge_1",
    name: "Joaquin's iPhone",
    createdAt: ago(20 * DAY),
    lastSeenAt: ago(2 * MIN),
  },
];
const bridgePairEmitter = new Emitter<BridgePairRequest>();
const bridgeChangeEmitter = new Emitter();

// Settings
const settings = {
  scrapeExportDir: "/Users/joaquin/Documents/MonchoOps/exports",
  headless: true,
  fullWindow: false,
  appVersion: "1.0.0",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function noopUnsub(): Unsubscribe {
  return () => {};
}

// ── API implementation ─────────────────────────────────────────────────────

const api: B2dmApi = {
  getPlatform: () => Promise.resolve("darwin" as NodeJS.Platform),
  getIsFullScreen: () => Promise.resolve(false),
  onFullScreenChange: () => noopUnsub(),
  setWindowButtonPosition: () => Promise.resolve(),
  openExternalLink: (url: string) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
    return Promise.resolve();
  },
  onSystemSuspend: () => noopUnsub(),
  onSystemResume: () => noopUnsub(),
  onPrepareQuit: () => noopUnsub(),
  quitReady: () => {},
  onNavigateToSettings: () => noopUnsub(),
  onDeepLink: () => noopUnsub(),
  getPendingDeepLink: () => Promise.resolve(null),
  clearPendingDeepLink: () => Promise.resolve(),

  getSession: () => {
    startTick();
    return delay(session);
  },
  validateLicense: () => delay(session),
  logout: () => {
    session = { hasLicense: false, profile: null, subscription: null };
    sessionEmitter.emit(session);
    // Restore after a beat so demo keeps working when navigated back.
    setTimeout(() => {
      session = DEFAULT_SESSION;
      sessionEmitter.emit(session);
    }, 800);
    return Promise.resolve();
  },
  onSessionChange: (cb) => sessionEmitter.on(cb),

  accounts: {
    list: () => delay([...accounts]),
    get: (id) => delay(accounts.find((a) => a.id === id) ?? null),
    startLogin: async () => ({ jobId: uid("job") }),
    startAutoLogin: async () => ({ jobId: uid("job") }),
    retryLogin: async () => ({ jobId: uid("job") }),
    startBulkAutoLogin: async () => ({ jobId: uid("job") }),
    delete: async (id) => {
      const idx = accounts.findIndex((a) => a.id === id);
      if (idx >= 0) accounts.splice(idx, 1);
      accountsEmitter.emit();
    },
    updateProxy: async ({ id, url, username, password: _password, enabled }) => {
      const acc = accounts.find((a) => a.id === id);
      if (!acc) throw new Error("Account not found");
      acc.proxyUrl = url;
      acc.proxyUsername = username;
      acc.hasProxyPassword = !!_password || acc.hasProxyPassword;
      if (typeof enabled === "boolean") acc.proxyEnabled = enabled;
      acc.updatedAt = Date.now();
      accountsEmitter.emit();
      return acc;
    },
    onChange: (cb) => accountsEmitter.on(cb),
  },

  jobs: {
    list: () => delay([...jobs] as JobPublic[]),
    listRunning: () => delay(jobs.filter((j) => j.status === "running") as JobPublic[]),
    listActive: () =>
      delay(
        jobs.filter((j) => j.status === "running" || j.status === "queued") as JobPublic[]
      ),
    cancel: async (jobId) => {
      const j = jobs.find((x) => x.id === jobId);
      if (!j) return;
      j.status = "cancelled" satisfies JobStatus;
      j.endedAt = Date.now();
      jobsEmitter.emit();
      jobDoneEmitter.emit({ jobId, status: "cancelled" });
    },
    startMassDm: async () => {
      const id = uid("job");
      jobs.unshift({
        id,
        accountId: "acc_1",
        kind: "mass_dm" satisfies JobKind,
        params: {},
        status: "running" satisfies JobStatus,
        startedAt: Date.now(),
        runningAt: Date.now(),
        endedAt: null,
        progressDone: 0,
        progressTotal: 200,
        error: null,
      });
      jobsEmitter.emit();
      return id;
    },
    startScrape: async () => {
      const id = uid("job");
      jobs.unshift({
        id,
        accountId: "acc_1",
        kind: "scrape_by_hashtag" satisfies JobKind,
        params: {},
        status: "running" satisfies JobStatus,
        startedAt: Date.now(),
        runningAt: Date.now(),
        endedAt: null,
        progressDone: 0,
        progressTotal: 500,
        error: null,
      });
      jobsEmitter.emit();
      return id;
    },
    onChange: (cb) => jobsEmitter.on(cb),
    onProgress: (cb) => jobProgressEmitter.on(cb),
    onDone: (cb) => jobDoneEmitter.on(cb),
    onAccountDrained: (cb) => accountDrainedEmitter.on(cb),
    onLoginFinished: (cb) => loginFinishedEmitter.on(cb),
  },

  scrapes: {
    list: () => delay([...scrapes]),
    get: (jobId) => delay(scrapes.find((s) => s.jobId === jobId) ?? null),
    listUsernames: (jobId) => {
      const s = scrapes.find((x) => x.jobId === jobId);
      const count = Math.min(s?.usernameCount ?? 0, 80);
      const rows: ScrapeUsernameRow[] = Array.from({ length: count }).map((_, i) => ({
        username: pickUsername(i + 3),
        source: s?.targetName ?? null,
        sourceRef: jobId,
      }));
      return delay(rows);
    },
    download: () => delay("/exports/scrape.csv"),
    revealInFolder: () => Promise.resolve(),
  },

  massDms: {
    list: () => delay([...massDms]),
    get: (jobId) => delay(massDms.find((m) => m.jobId === jobId) ?? null),
    listSends: (jobId) => delay(massDmSendsFor(jobId)),
    listDmedUsernames: () => delay([] as string[]),
  },

  categories: {
    list: () => delay([...categories]),
    create: async (name) => {
      const cat: LeadCategoryPublic = {
        id: uid("cat"),
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadCount: 0,
        scrapeCount: 0,
        lastActivityAt: null,
      };
      categories.push(cat);
      categoriesEmitter.emit();
      return cat;
    },
    rename: async (id, name) => {
      const c = categories.find((x) => x.id === id);
      if (!c) throw new Error("Category not found");
      c.name = name;
      c.updatedAt = Date.now();
      categoriesEmitter.emit();
      return c;
    },
    delete: async (id) => {
      const i = categories.findIndex((x) => x.id === id);
      if (i >= 0) categories.splice(i, 1);
      categoriesEmitter.emit();
    },
    listLeads: ({ categoryId, limit, offset }) => {
      const all = leadsForCategory(categoryId);
      const off = offset ?? 0;
      const lim = limit ?? all.length;
      return delay(all.slice(off, off + lim));
    },
    exportCsv: async () => "/exports/category.csv",
    onChange: (cb) => categoriesEmitter.on(cb),
  },

  messageVariants: {
    list: () => delay([...variants]),
    create: async ({ name, variants: vs }) => {
      const v: MessageVariantGroupPublic = {
        id: uid("var"),
        name,
        variants: vs,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      variants.push(v);
      variantsEmitter.emit();
      return v;
    },
    update: async ({ id, name, variants: vs }) => {
      const v = variants.find((x) => x.id === id);
      if (!v) throw new Error("Variant group not found");
      v.name = name;
      v.variants = vs;
      v.updatedAt = Date.now();
      variantsEmitter.emit();
      return v;
    },
    delete: async (id) => {
      const i = variants.findIndex((x) => x.id === id);
      if (i >= 0) variants.splice(i, 1);
      variantsEmitter.emit();
    },
    onChange: (cb) => variantsEmitter.on(cb),
  },

  csv: {
    pickAndPersist: async () => ({ path: "/uploads/leads.csv", count: 320 }),
    persistFromPath: async () => ({ path: "/uploads/leads.csv", count: 320 }),
    listUsernames: async () => FAKE_USERNAMES.slice(0, 40),
    persistFromUsernames: async (usernames) => ({
      path: "/uploads/from_usernames.csv",
      count: usernames.length,
    }),
    persistFromCategory: async (categoryId) => ({
      path: "/uploads/from_category.csv",
      count: categories.find((c) => c.id === categoryId)?.leadCount ?? 0,
    }),
    persistFromCategories: async (ids) => ({
      path: "/uploads/from_categories.csv",
      count: ids.reduce(
        (sum, id) => sum + (categories.find((c) => c.id === id)?.leadCount ?? 0),
        0
      ),
    }),
    persistFromScrape: async (jobId) => ({
      path: `/uploads/scrape_${jobId}.csv`,
      count: scrapes.find((s) => s.jobId === jobId)?.usernameCount ?? 0,
    }),
    persistFromScrapes: async (ids) => ({
      path: "/uploads/scrapes.csv",
      count: ids.reduce(
        (sum, id) => sum + (scrapes.find((s) => s.jobId === id)?.usernameCount ?? 0),
        0
      ),
    }),
  },

  settings: {
    refreshSession: () => delay(session),
    deleteAllAccounts: async () => {
      accounts.length = 0;
      accountsEmitter.emit();
    },
    deleteAllScrapes: async () => {
      scrapes.length = 0;
    },
    selectDirectory: async () => "/Users/joaquin/Documents/MonchoOps/exports",
    getAppVersion: () => delay(settings.appVersion),
    wipeAllData: async () => {},
    getScrapeExportDir: () => delay(settings.scrapeExportDir),
    setScrapeExportDir: async (dir) => {
      settings.scrapeExportDir = dir;
    },
    getHeadless: () => delay(settings.headless),
    setHeadless: async (h) => {
      settings.headless = h;
    },
    getFullWindow: () => delay(settings.fullWindow),
    setFullWindow: async (f) => {
      settings.fullWindow = f;
    },
  },

  stats: {
    get: () => delay({ ...stats }),
  },

  updater: {
    getState: () => delay(updateState),
    checkForUpdates: async () => {
      updateState = { kind: "not-available" };
      updateEmitter.emit(updateState);
    },
    installAndRestart: async () => {},
    onStateChange: (cb) => updateEmitter.on(cb),
  },

  bridge: {
    getStatus: () => delay({ ...bridgeStatus }),
    listPaired: () => delay([...pairedClients]),
    revoke: async (id) => {
      const i = pairedClients.findIndex((c) => c.id === id);
      if (i >= 0) pairedClients.splice(i, 1);
      bridgeChangeEmitter.emit();
    },
    resolvePairing: async () => ({ ok: true }),
    onPairRequest: (cb) => bridgePairEmitter.on(cb),
    onChange: (cb) => bridgeChangeEmitter.on(cb),
  },
};

// Avoid unused warnings in case branches are removed later.
void [scrapeKinds, accountDrainedEmitter, loginFinishedEmitter];

// Keep AccountStatus import in scope (it's used via the AccountPublic type).
const _AccountStatus: AccountStatus = "idle";
void _AccountStatus;

declare global {
  interface Window {
    b2dm: B2dmApi;
  }
}

export const b2dm: B2dmApi = api;

if (typeof window !== "undefined") {
  // Expose on window so any third-party code that reaches for `window.b2dm`
  // (the original Electron preload contract) finds the same instance.
  (window as Window & { b2dm: B2dmApi }).b2dm = api;
}
