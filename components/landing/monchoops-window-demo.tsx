"use client";

import {
  CheckCircle2,
  Database,
  Flame,
  History,
  Home,
  Instagram,
  ListTodo,
  Loader2,
  MessageSquareText,
  Search,
  Send,
  Settings,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Screen = "home" | "accounts" | "cold-dm" | "queue";

const SCREENS: { id: Screen; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "accounts", label: "Accounts" },
  { id: "cold-dm", label: "Cold DM" },
  { id: "queue", label: "Queue" },
];

const NAV_ITEMS: {
  id:
    | Screen
    | "scrape"
    | "warmup"
    | "leads"
    | "categories"
    | "variants"
    | "history"
    | "settings";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "accounts", label: "Accounts", icon: Instagram },
  { id: "scrape", label: "Scrape", icon: Search },
  { id: "warmup", label: "Warmup", icon: Flame },
  { id: "cold-dm", label: "Cold DM", icon: Send },
  { id: "queue", label: "Queue", icon: ListTodo },
  { id: "leads", label: "Leads", icon: Database },
  { id: "categories", label: "Categories", icon: Users },
  { id: "variants", label: "Variants", icon: MessageSquareText },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const FAKE_ACCOUNTS = [
  { username: "@monchoops.studio", status: "Warmed", proxy: "us-residential-1", lastSync: "2m ago" },
  { username: "@growth.lab.io", status: "Warming", proxy: "br-mobile-3", lastSync: "Active" },
  { username: "@buenosaires.tech", status: "Idle", proxy: "ar-residential-2", lastSync: "12m ago" },
  { username: "@moncho.creators", status: "Warmed", proxy: "us-residential-7", lastSync: "5m ago" },
  { username: "@yoga.studios.ny", status: "Busy", proxy: "us-residential-1", lastSync: "Active" },
];

const FAKE_QUEUE = [
  { type: "Cold DM", title: "Tech Founders LATAM", account: "@monchoops.studio", progress: 184, total: 320, status: "running" as const },
  { type: "Scrape", title: "By hashtag #saas", account: "@growth.lab.io", progress: 412, total: 800, status: "running" as const },
  { type: "Warmup", title: "Daily session", account: "@buenosaires.tech", progress: 18, total: 45, status: "running" as const },
  { type: "Cold DM", title: "Yoga studios — NYC", account: "@yoga.studios.ny", progress: 0, total: 220, status: "queued" as const },
];

const FAKE_CAMPAIGN_PREVIEW = [
  { username: "@laura.builds", status: "sent", variant: "Pitch A" },
  { username: "@kevin.devshop", status: "sent", variant: "Pitch B" },
  { username: "@noora.eats.ny", status: "sent", variant: "Pitch A" },
  { username: "@octavio.studio", status: "sending", variant: "Pitch C" },
  { username: "@maite.builds.it", status: "queued", variant: "Pitch B" },
  { username: "@sebasf.dev", status: "queued", variant: "Pitch A" },
];

function StatusPill({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Warmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Warming: "bg-orange-50 text-orange-700 border-orange-200",
    Idle: "bg-gray-50 text-gray-600 border-gray-200",
    Busy: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
        variants[status] ?? "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

function HomeScreen() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Wednesday, April 26
        </p>
        <h2 className="text-xl text-gray-900 font-semibold">
          Welcome back, Joaquin
        </h2>
        <p className="text-xs text-gray-500">What do you want to do today?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
          <Search className="h-5 w-5 text-gray-700 mb-2" />
          <h3 className="text-sm font-semibold text-gray-900">Scrape leads</h3>
          <p className="text-[11px] text-gray-500 mb-3">
            Pull qualified usernames from a profile, post, hashtag or location.
          </p>
          <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
            New scrape →
          </span>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
          <Send className="h-5 w-5 text-gray-700 mb-2" />
          <h3 className="text-sm font-semibold text-gray-900">Cold DM</h3>
          <p className="text-[11px] text-gray-500 mb-3">
            Launch a campaign with rotating message variants and warmups.
          </p>
          <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
            New campaign →
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Stat label="Accounts" value="5" />
        <Stat label="Leads" value="48,210" />
        <Stat label="DMs sent" value="12,847" />
        <Stat label="Hours saved" value="318" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}

function AccountsScreen() {
  return (
    <div className="flex flex-col p-4 gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Instagram accounts
          </h2>
          <p className="text-[11px] text-gray-500">
            5 connected · proxies assigned · sessions encrypted
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2 py-1 text-[10px] text-gray-700">
          <Shield className="h-3 w-3" /> Local only
        </span>
      </div>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-gray-50 px-3 py-2 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
          <div className="col-span-4">Account</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Proxy</div>
          <div className="col-span-3">Last activity</div>
        </div>
        {FAKE_ACCOUNTS.map((acc) => (
          <div
            key={acc.username}
            className="grid grid-cols-12 gap-2 px-3 py-2.5 text-xs items-center border-b border-gray-100 last:border-b-0"
          >
            <div className="col-span-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
              <span className="font-medium text-gray-900 truncate">
                {acc.username}
              </span>
            </div>
            <div className="col-span-2">
              <StatusPill status={acc.status} />
            </div>
            <div className="col-span-3 font-mono text-[11px] text-gray-600 truncate">
              {acc.proxy}
            </div>
            <div className="col-span-3 text-[11px] text-gray-500">
              {acc.lastSync}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColdDMScreen() {
  return (
    <div className="flex flex-col p-4 gap-3">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Cold DM — Tech Founders LATAM
        </h2>
        <p className="text-[11px] text-gray-500">
          From @monchoops.studio · 320 leads · 4 message variants · interval 45-90s
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-7 rounded-md border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <div className="text-[11px] font-semibold text-gray-700">
              Live progress
            </div>
            <div className="text-[11px] text-gray-500 tabular-nums">
              184 / 320 sent
            </div>
          </div>
          <div className="px-3 py-3">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-[57%] bg-emerald-500" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-emerald-50 p-2">
                <p className="text-lg font-semibold text-emerald-700 tabular-nums">
                  182
                </p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-700/70">
                  Sent
                </p>
              </div>
              <div className="rounded-md bg-red-50 p-2">
                <p className="text-lg font-semibold text-red-700 tabular-nums">
                  2
                </p>
                <p className="text-[10px] uppercase tracking-wider text-red-700/70">
                  Failed
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <p className="text-lg font-semibold text-gray-700 tabular-nums">
                  136
                </p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Pending
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 rounded-md border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-3 py-2">
            <div className="text-[11px] font-semibold text-gray-700">
              Recent sends
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {FAKE_CAMPAIGN_PREVIEW.map((row) => (
              <div
                key={row.username}
                className="flex items-center justify-between px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {row.status === "sent" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : row.status === "sending" ? (
                    <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin shrink-0" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span className="truncate text-gray-900">{row.username}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono ml-2">
                  {row.variant}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueScreen() {
  return (
    <div className="flex flex-col p-4 gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Job queue</h2>
          <p className="text-[11px] text-gray-500">
            3 running · 1 queued · all jobs cancellable from here
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="rounded-md border border-gray-200 bg-white divide-y divide-gray-100">
        {FAKE_QUEUE.map((job, i) => {
          const pct = job.total > 0 ? Math.round((job.progress / job.total) * 100) : 0;
          return (
            <div key={i} className="px-3 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {job.type === "Cold DM" ? (
                    <Send className="h-4 w-4 text-purple-700 shrink-0" />
                  ) : job.type === "Scrape" ? (
                    <Search className="h-4 w-4 text-gray-700 shrink-0" />
                  ) : (
                    <Flame className="h-4 w-4 text-orange-600 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {job.type} · {job.title}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {job.account}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] tabular-nums text-gray-600 ml-2">
                  {job.status === "queued" ? (
                    <span className="text-gray-400">queued</span>
                  ) : (
                    `${job.progress}/${job.total}`
                  )}
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full ${
                    job.status === "queued"
                      ? "bg-gray-300"
                      : job.type === "Cold DM"
                      ? "bg-purple-500"
                      : job.type === "Scrape"
                      ? "bg-gray-700"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SCREEN_RENDERERS: Record<Screen, () => React.ReactElement> = {
  home: HomeScreen,
  accounts: AccountsScreen,
  "cold-dm": ColdDMScreen,
  queue: QueueScreen,
};

export function MonchoOpsWindowDemo() {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const idx = SCREENS.findIndex((s) => s.id === prev);
        return SCREENS[(idx + 1) % SCREENS.length].id;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ActiveScreen = useMemo(
    () => SCREEN_RENDERERS[activeScreen],
    [activeScreen]
  );

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-3 text-[11px] font-semibold text-gray-700">
            MonchoOps
          </span>
        </div>
        <div className="flex items-center gap-1">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScreen(s.id)}
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                activeScreen === s.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-44 shrink-0 border-r border-gray-200 bg-gray-50 px-2 py-3 flex flex-col gap-0.5 text-[11px]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeScreen;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {item.id === "queue" && (
                  <span className="ml-auto text-[9px] rounded-full bg-emerald-500 text-white px-1.5">
                    3
                  </span>
                )}
              </div>
            );
          })}
          <div className="mt-auto rounded-md border border-gray-200 bg-white px-2 py-2 text-[10px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sessions encrypted locally
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 overflow-hidden bg-white">
          <ActiveScreen />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-[10px] text-gray-500">
        <div className="flex items-center gap-3">
          <span className="font-mono">v1.0.0</span>
          <span>5 accounts</span>
          <span>3 jobs running</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="h-3 w-3" />
          <span>0 errors today</span>
        </div>
      </div>
    </div>
  );
}
