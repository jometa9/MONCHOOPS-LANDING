"use client";

import { MacOSIcon } from "@/components/icons/macos-icon";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { MonchoOpsWindowDemo } from "@/components/landing/monchoops-window-demo";
import { ArrowDownToLine, Check } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ProductKey } from "@/lib/db/schema";
import {
  DownloadOS,
  fetchAppVersion,
  handleDownload,
} from "@/lib/download-handler";

interface AppVersionInfo {
  version: string;
  downloadUrls: { mac: string; windows: string };
}

export function ProductsSection() {
  const t = useTranslations("products");
  const locale = useLocale();
  const [downloads, setDownloads] = useState<AppVersionInfo | null>(null);
  const [menuBarClock, setMenuBarClock] = useState("");

  useEffect(() => {
    const loadDownloads = async () => {
      const data = await fetchAppVersion();
      setDownloads(data);
    };
    loadDownloads();
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

  const hasDownloadUrl = (productKey: ProductKey, os: DownloadOS): boolean => {
    if (!downloads) return true;
    if (productKey !== "monchoops") return false;
    return os === "mac"
      ? !!downloads.downloadUrls?.mac
      : !!downloads.downloadUrls?.windows;
  };

  const handleDownloadClick = async (
    productKey: ProductKey,
    os: DownloadOS
  ) => {
    if (downloads && !hasDownloadUrl(productKey, os)) return;
    await handleDownload(productKey, os);
  };

  const bullets = [
    t("bullet1"),
    t("bullet2"),
    t("bullet3"),
    t("bullet4"),
    t("bullet5"),
    t("bullet6"),
  ];

  return (
    <section className="pt-24" id="products">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">{t("eyebrow")}</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          {t("headingP1")}<br className="sm:hidden" /> {t("headingP2")}<br className="sm:hidden" /> {t("headingP3")}
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
                    <p className="text text-gray-500">{t("platforms")}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                  {t("description")}
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
                    className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      hasDownloadUrl("monchoops", "windows")
                        ? "cursor-pointer"
                        : "cursor-default opacity-60"
                    }`}
                    onClick={() => handleDownloadClick("monchoops", "windows")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WindowsIcon className="h-4 w-4 text-gray-700" />
                        <p className="font-semibold text-gray-700">
                          {t("downloadWindows")}<span className="hidden sm:inline">{t("downloadWindowsArch")}</span>
                        </p>
                      </div>
                      <ArrowDownToLine className="h-4 w-4 text-gray-700" />
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      hasDownloadUrl("monchoops", "mac")
                        ? "cursor-pointer"
                        : "cursor-default opacity-60"
                    }`}
                    onClick={() => handleDownloadClick("monchoops", "mac")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MacOSIcon className="h-4 w-4 text-gray-700" />
                        <p className="font-semibold text-gray-700">
                          {t("downloadMac")}<span className="hidden sm:inline">{t("downloadMacArch")}</span>
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
                  <span>·</span>
                  <span suppressHydrationWarning>{menuBarClock}</span>
                </div>
              </div>
              <div className="relative z-10 w-full max-w-[78%] aspect-[980/600] rounded-lg overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <MonchoOpsWindowDemo />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"
              >
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/15 backdrop-blur-md p-1.5 shadow-lg">
                  <Image
                    src="/monchoops-icon.png"
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
      </div>
    </section>
  );
}
