"use client";

import { MacOSIcon } from "@/components/icons/macos-icon";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { ArrowDownToLine, Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductKey } from "@/lib/db/schema";
import {
  DownloadOS,
  fetchAllDownloads,
  handleDownload,
} from "@/lib/download-handler";

interface DownloadInfo {
  version: string;
  downloadUrl: string;
}

interface AllDownloads {
  monchoops: {
    windows: DownloadInfo;
    mac: DownloadInfo;
  };
}

export function ProductsSection() {
  const [downloads, setDownloads] = useState<AllDownloads | null>(null);

  useEffect(() => {
    const loadDownloads = async () => {
      const data = await fetchAllDownloads();
      setDownloads(data);
    };
    loadDownloads();
  }, []);

  const hasDownloadUrl = (productKey: ProductKey, os: DownloadOS): boolean => {
    if (!downloads) return true;
    if (productKey !== "monchoops") return false;
    return os === "mac"
      ? !!downloads.monchoops?.mac?.downloadUrl
      : !!downloads.monchoops?.windows?.downloadUrl;
  };

  const handleDownloadClick = async (
    productKey: ProductKey,
    os: DownloadOS
  ) => {
    if (downloads && !hasDownloadUrl(productKey, os)) return;
    await handleDownload(productKey, os);
  };

  const bullets = [
    "Connect multiple Instagram accounts and run them in parallel",
    "Scrape usernames from any profile, post, hashtag or location to build your lead list",
    "Send mass DMs with up to 20 message variants so every message feels unique",
    "Warm up each lead with a follow, story view and likes before the DM",
    "Never message the same prospect twice — duplicates are skipped automatically",
    "Track every campaign live with progress, sent count and one-click cancel",
  ];

  return (
    <section className="pt-24" id="products">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">The desktop app</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          One installer.<br className="sm:hidden" /> Scrape, send, track.<br className="sm:hidden" /> Done.
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
                    <p className="text text-gray-500">Windows and macOS</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                  The desktop app to scrape Instagram leads, run multiple
                  accounts at once and send mass DMs that actually land.
                  Build your lead list, warm up prospects and track every
                  campaign — all from one place.
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
                          Download for Windows<span className="hidden sm:inline"> 64-bit</span>
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
                          Download for macOS<span className="hidden sm:inline"> Apple Silicon</span>
                        </p>
                      </div>
                      <ArrowDownToLine className="h-4 w-4 text-gray-700" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-1 relative h-full min-h-[260px] md:min-h-0 overflow-hidden rounded-lg border border-gray-200 shadow-lg bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 h-56 w-56 rounded-full bg-violet-300/30 blur-3xl pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                  { top: "4%", left: "18%", size: "h-20 w-20", color: "stroke-indigo-300", opacity: "opacity-25", rotate: "-18deg" },
                  { top: "22%", left: "-4%", size: "h-36 w-36", color: "stroke-indigo-500", opacity: "opacity-15", rotate: "12deg" },
                  { top: "-6%", right: "12%", size: "h-28 w-28", color: "stroke-indigo-400", opacity: "opacity-20", rotate: "24deg" },
                  { top: "44%", right: "-6%", size: "h-44 w-44", color: "stroke-indigo-600", opacity: "opacity-12", rotate: "-8deg" },
                  { bottom: "18%", left: "32%", size: "h-16 w-16", color: "stroke-indigo-400", opacity: "opacity-30", rotate: "32deg" },
                  { bottom: "-4%", left: "8%", size: "h-32 w-32", color: "stroke-indigo-300", opacity: "opacity-18", rotate: "-22deg" },
                  { bottom: "8%", right: "22%", size: "h-24 w-24", color: "stroke-indigo-500", opacity: "opacity-22", rotate: "16deg" },
                  { top: "60%", left: "44%", size: "h-14 w-14", color: "stroke-indigo-600", opacity: "opacity-20", rotate: "-30deg" },
                ].map((b, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${b.size} ${b.color} ${b.opacity} absolute`}
                    style={{
                      top: b.top,
                      left: b.left,
                      right: b.right,
                      bottom: b.bottom,
                      transform: `rotate(${b.rotate})`,
                    }}
                  >
                    <rect width="7" height="7" x="14" y="3" rx="2" />
                    <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
                  </svg>
                ))}
              </div>
              <div className="relative z-10 px-6 py-24 max-w-md text-center">
                <Image
                  src="/assets/instagram.png"
                  alt="Instagram"
                  width={256}
                  height={256}
                  className="mx-auto h-20 w-20"
                />
                <p className="mt-4 text-2xl font-semibold text-gray-900">
                  Built for Instagram outreach
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Scrape leads, run multiple accounts and send mass DMs from your desktop
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Auto-updates included
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
