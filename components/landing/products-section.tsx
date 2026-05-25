"use client";

import { ChromeIcon } from "@/components/icons/chrome-icon";
import { MacOSIcon } from "@/components/icons/macos-icon";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { MonchoOpsWindowDemo } from "@/components/landing/monchoops-window-demo";
import { Activity, ArrowDownToLine, ArrowLeft, ArrowRight, Check, ExternalLink, Instagram, Lock, LogOut, MoreVertical, Pause, Play, Puzzle, RotateCw } from "lucide-react";
import Image from "next/image";
import { STRINGS } from "@/lib/strings";
import { useEffect, useRef, useState } from "react";
import { DownloadOS, triggerDownload } from "@/lib/download-config";

const EXTENSION_BASE_WIDTH = 800;
const EXTENSION_BASE_HEIGHT = 500;

export function ProductsSection() {
  const t = STRINGS.products;
  const locale = "en";
  const [menuBarClock, setMenuBarClock] = useState("");
  const extensionRef = useRef<HTMLDivElement | null>(null);
  const [extensionScale, setExtensionScale] = useState(1);

  useEffect(() => {
    const el = extensionRef.current;
    if (!el) return;
    const update = () => {
      const { width } = el.getBoundingClientRect();
      if (width <= 0) return;
      setExtensionScale(width / EXTENSION_BASE_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const intlLocale = locale === "es" ? "es-ES" : "en-US";
      const day = now.toLocaleDateString(intlLocale, { weekday: "short" });
      const time = now.toLocaleTimeString(intlLocale, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setMenuBarClock(`${day} ${time}`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [locale]);

  const handleDownloadClick = (os: DownloadOS) => {
    triggerDownload(os);
  };

  const bullets = [
    t.bullets[0],
    t.bullets[1],
    t.bullets[2],
    t.bullets[3],
    t.bullets[4],
    t.bullets[5],
  ];

  const extensionBullets = [
    t.extension.bullets[0],
    t.extension.bullets[1],
    t.extension.bullets[2],
    t.extension.bullets[3],
  ];

  return (
    <section className="pt-24" id="products">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">{t.eyebrow}</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          {t.headingP1}<br className="sm:hidden" /> {t.headingP2}<br className="sm:hidden" /> {t.headingP3}
        </h2>

        <div className="bg-gray-100 rounded-lg p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-8">
            <div className="flex flex-col justify-between order-2 md:order-2">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <Image
                    src="/monchoops-icon.png"
                    alt="MonchoOps"
                    width={128}
                    height={128}
                    className="h-16 w-16"
                  />

                  <div>
                    <h3 className="text-2xl font-semibold">MonchoOps</h3>
                    <p className="text text-gray-500">{t.platforms}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                  {t.description}
                </p>
                <ul className="space-y-1.5 text-xs text-gray-600 mb-4">
                  {bullets.map((text) => (
                    <li key={text} className="flex items-start">
                      <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gray-600" />
                      <p className="ml-2.5">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDownloadClick("windows")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WindowsIcon className="h-4 w-4 text-gray-700" />
                        <p className="font-semibold text-gray-700">
                          {t.downloadWindows}<span className="hidden sm:inline">{t.downloadWindowsArch}</span>
                        </p>
                      </div>
                      <ArrowDownToLine className="h-4 w-4 text-gray-700" />
                    </div>
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDownloadClick("mac")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MacOSIcon className="h-4 w-4 text-gray-700" />
                        <p className="font-semibold text-gray-700">
                          {t.downloadMac}<span className="hidden sm:inline">{t.downloadMacArch}</span>
                        </p>
                      </div>
                      <ArrowDownToLine className="h-4 w-4 text-gray-700" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="order-1 md:order-1 relative h-full min-h-[260px] md:min-h-0 overflow-hidden rounded-lg border border-gray-200 shadow-lg flex items-center justify-center px-8 py-14 md:px-12 md:py-20"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 25% 15%, rgba(251,207,232,0.55) 0%, transparent 70%), radial-gradient(ellipse 100% 80% at 90% 35%, rgba(196,181,253,0.55) 0%, transparent 75%), radial-gradient(ellipse 110% 90% at 50% 110%, rgba(99,102,241,0.45) 0%, transparent 75%), linear-gradient(160deg, #4f46e5 0%, #6d28d9 50%, #312e81 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                  maskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 90%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 90%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-black/30 backdrop-blur-md border-b border-white/5 z-20 flex items-center justify-between px-4"
              >
                <div className="flex items-center gap-3 text-[10px] font-medium text-white/85">
                  <span className="text-white">●</span>
                  <span className="font-semibold">MonchoOps</span>
                  <span className="text-white/70">File</span>
                  <span className="text-white/70">Edit</span>
                  <span className="text-white/70">View</span>
                  <span className="text-white/70">Window</span>
                  <span className="text-white/70">Help</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/70">
                  <span>100%</span>
                  <span>-</span>
                  <span suppressHydrationWarning>{menuBarClock}</span>
                </div>
              </div>
              <div
                className="relative z-10 w-full max-w-[78%] aspect-[980/600] overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10"
                style={{ borderRadius: "8px" }}
              >
                <MonchoOpsWindowDemo />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"
              >
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/15 backdrop-blur-md p-1.5 shadow-lg">
                  <Image
                    src="/assets/monchoops_square.png"
                    alt=""
                    width={32}
                    height={32}
                    className="h-6 w-6 rounded-md"
                  />
                  <span className="h-6 w-6 rounded-md bg-white/40" />
                  <span className="h-6 w-6 rounded-md bg-white/30" />
                  <span className="h-6 w-6 rounded-md bg-white/30" />
                  <span className="h-6 w-px bg-white/30 mx-1" />
                  <span className="h-6 w-6 rounded-md bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-xl mb-1">{t.extension.eyebrow}</p>
          <h2 className="text-3xl text-gray-900 mb-6">
            {t.extension.headingP1}<br className="sm:hidden" /> {t.extension.headingP2}<br className="sm:hidden" /> {t.extension.headingP3}
          </h2>

          <div className="bg-gray-100 rounded-lg p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-8">
              <div className="flex flex-col justify-between order-1 md:order-1">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <ChromeIcon className="h-16 w-16" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-semibold">MonchoOps</h3>
                        <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                          {t.extension.badge}
                        </span>
                      </div>
                      <p className="text text-gray-500">{t.extension.platforms}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                    {t.extension.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-600 mb-4">
                    {extensionBullets.map((text) => (
                      <li key={text} className="flex items-start">
                        <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gray-600" />
                        <p className="ml-2.5">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChromeIcon className="h-4 w-4" />
                        <p className="font-semibold text-gray-700">
                          {t.extension.addToChrome}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </div>
                  </a>
                </div>
              </div>

              <div
                className="order-2 md:order-2 relative overflow-hidden rounded-lg border border-gray-200 shadow-lg flex items-center justify-center px-8 py-14 md:px-12 md:py-20"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 70% at 25% 15%, rgba(254,226,226,0.6) 0%, transparent 70%), radial-gradient(ellipse 100% 80% at 90% 35%, rgba(254,243,199,0.55) 0%, transparent 75%), radial-gradient(ellipse 110% 90% at 50% 110%, rgba(187,247,208,0.5) 0%, transparent 75%), linear-gradient(160deg, #1d4ed8 0%, #1e40af 50%, #0f172a 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage:
                      "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 90%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 90%)",
                  }}
                />

                <div
                  ref={extensionRef}
                  className="relative z-10 w-full max-w-[92%] aspect-[16/10] overflow-hidden rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    style={{
                      width: EXTENSION_BASE_WIDTH,
                      height: EXTENSION_BASE_HEIGHT,
                      transform: `scale(${extensionScale})`,
                      transformOrigin: "center center",
                      flex: "none",
                    }}
                  >
                  <div className="relative h-full w-full bg-[#dadce0]">
                  <div className="flex items-end gap-2 px-3 pt-2 pb-0 bg-[#dadce0]">
                    <div className="flex items-center gap-1.5 pb-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="ml-2 bg-white px-3 pt-1 pb-0.5 text-[9px] text-gray-700 flex items-center gap-1.5"
                      style={{
                        borderTopLeftRadius: "7px",
                        borderTopRightRadius: "7px",
                      }}
                    >
                      Instagram
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-b border-gray-200">
                    <ArrowLeft className="h-3 w-3 text-gray-700" strokeWidth={2} />
                    <ArrowRight className="h-3 w-3 text-gray-400" strokeWidth={2} />
                    <RotateCw className="h-3 w-3 text-gray-700" strokeWidth={2} />
                    <div className="flex-1 ml-1 rounded-full bg-gray-100 px-2.5 py-1 text-[9px] text-gray-700 flex items-center gap-1.5">
                      <Lock className="h-2 w-2 text-gray-500" strokeWidth={2.5} />
                      instagram.com/direct/inbox
                    </div>
                    <Puzzle className="h-3 w-3 text-gray-500" strokeWidth={2} />
                    <div className="relative rounded-md bg-gray-100 p-0.5 ring-1 ring-gray-300">
                      <Image
                        src="/assets/monchoops_square.png"
                        alt=""
                        width={20}
                        height={20}
                        className="h-3 w-3 rounded-sm"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                    </div>
                    <MoreVertical className="h-3 w-3 text-gray-500" strokeWidth={2} />
                  </div>

                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100" style={{ height: "calc(100% - 52px)" }}>
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />

                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center pb-20"
                    >
                      <span className="text-6xl font-bold text-gray-300 select-none">
                        MonchoOps
                      </span>
                    </div>

                    <div className="absolute right-[4%] top-0 z-10 w-[58%] max-w-[280px] overflow-hidden bg-white shadow-2xl shadow-black/30 ring-1 ring-black/5 text-gray-900">
                      <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-2.5 py-1.5">
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold leading-tight">MonchoOps</p>
                          <p className="truncate text-[8px] leading-tight text-gray-500">
                            joaquin@monchoops.com - pro
                          </p>
                        </div>
                        <LogOut className="h-2.5 w-2.5 shrink-0 text-gray-400" />
                      </div>

                      <div className="space-y-2 p-2">
                        <div className="border border-gray-200 bg-white">
                          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1">
                            <span className="flex items-center gap-1 text-[7px] font-medium uppercase tracking-wide text-gray-500">
                              <Instagram className="h-2 w-2" />
                              {t.extension.popup.instagramSession}
                            </span>
                            <span className="text-[7px] font-medium text-emerald-600">
                              {t.extension.popup.active}
                            </span>
                          </div>
                          <div className="px-2 py-1.5 text-[7px] leading-snug text-gray-500">
                            {t.extension.popup.operatesOnAccount}
                          </div>
                        </div>

                        <div className="border border-gray-200 bg-white">
                          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1">
                            <span className="flex items-center gap-1 text-[7px] font-medium uppercase tracking-wide text-gray-500">
                              <Activity className="h-2 w-2" />
                              {t.extension.popup.activeProcesses}
                            </span>
                            <span className="text-[7px] tabular-nums text-gray-500">2</span>
                          </div>
                          <ul>
                            <li className="border-b border-gray-200 px-2 py-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-1">
                                  <Play className="h-2 w-2 shrink-0 text-emerald-600" />
                                  <span className="truncate text-[8px] font-medium">
                                    {t.extension.popup.campaign1}
                                  </span>
                                </span>
                                <span className="shrink-0 text-[7px] font-medium uppercase tracking-wide text-emerald-600">
                                  {t.extension.popup.running}
                                </span>
                              </div>
                              <div className="mt-1 h-[3px] w-full overflow-hidden bg-gray-100">
                                <div className="h-full w-[62%] bg-emerald-500" />
                              </div>
                              <p className="mt-0.5 text-[7px] tabular-nums text-gray-500">
                                {t.extension.popup.processed1}
                              </p>
                            </li>
                            <li className="px-2 py-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-1">
                                  <Pause className="h-2 w-2 shrink-0 text-amber-600" />
                                  <span className="truncate text-[8px] font-medium">
                                    {t.extension.popup.campaign2}
                                  </span>
                                </span>
                                <span className="shrink-0 text-[7px] font-medium uppercase tracking-wide text-amber-600">
                                  {t.extension.popup.paused}
                                </span>
                              </div>
                              <div className="mt-1 h-[3px] w-full overflow-hidden bg-gray-100">
                                <div className="h-full w-[36%] bg-amber-500" />
                              </div>
                              <p className="mt-0.5 text-[7px] tabular-nums text-gray-500">
                                {t.extension.popup.processed2}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 bg-gray-50 p-1.5">
                        <div className="flex h-5 items-center justify-center bg-gray-900 px-2 text-[8px] font-medium text-white">
                          {t.extension.popup.openDashboard}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
