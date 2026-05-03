"use client";

import { Blocks, ArrowDownToLine, Globe, Send } from "lucide-react";
import { ProductKey } from "@/lib/db/schema";
import {
  DownloadOS,
  detectOS,
  fetchAllDownloads,
  handleDownload,
} from "@/lib/download-handler";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { MacOSIcon } from "@/components/icons/macos-icon";
import { useEffect, useState } from "react";

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

export function StepsSection() {
  const [downloads, setDownloads] = useState<AllDownloads | null>(null);
  const [, setUserOS] = useState<DownloadOS>("windows");

  useEffect(() => {
    const loadDownloads = async () => {
      const data = await fetchAllDownloads();
      setDownloads(data);
    };

    loadDownloads();
    setUserOS(detectOS());
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

  return (
    <section id="how-it-works" className="overflow-x-hidden scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">How it works</p>
        <h2 className="text-4xl md:text-6xl text-gray-900 mb-6">
          Setup in three steps
        </h2>

        <div
          data-step="1"
          className="rounded-lg bg-gray-100 p-6 mb-6 max-w-full overflow-x-hidden box-border"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[40%_1fr] gap-8 items-center">
            <div className="order-1 xl:order-1 min-w-0 xl:pr-6 pb-6 xl:pb-0">
              <p className="text-sm uppercase st text-gray-500 mb-2">
                Step 1
              </p>
              <h3 className="text-3xl md:text-4xl text-gray-900">
                Download MonchoOps
              </h3>
              <p className="text-gray-600 mt-4">
                Native installer for Windows and macOS. The app weighs ~250 MB
                — Chromium is bundled. No external services or extra runtimes
                required. Open it, sign in with your MonchoOps license, you&apos;re
                ready to add accounts.
              </p>
            </div>

            <div className="order-2 xl:order-2 min-w-0 xl:w-full">
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4 max-w-md ml-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Blocks className="w-4 h-4 shrink-0" />
                  <span className="text-lg text-gray-700">MonchoOps</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Instagram outreach desktop app · runs locally
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    className={`w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between gap-2 bg-gray-50 hover:bg-white transition-colors text-left ${
                      hasDownloadUrl("monchoops", "windows")
                        ? ""
                        : "opacity-60 cursor-default"
                    }`}
                    onClick={() => handleDownloadClick("monchoops", "windows")}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <WindowsIcon className="h-4 w-4 shrink-0 text-black" />
                      <span className="text-xs font-medium text-gray-700">
                        Download for Windows 64-bit
                      </span>
                    </span>
                    <ArrowDownToLine className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className={`w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between gap-2 bg-gray-50 hover:bg-white transition-colors text-left ${
                      hasDownloadUrl("monchoops", "mac")
                        ? ""
                        : "opacity-60 cursor-default"
                    }`}
                    onClick={() => handleDownloadClick("monchoops", "mac")}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <MacOSIcon className="h-4 w-4 shrink-0 text-black" />
                      <span className="text-xs font-medium text-gray-700">
                        Download for macOS Apple Silicon
                      </span>
                    </span>
                    <ArrowDownToLine className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-step="2"
          className="rounded-lg bg-gray-900 p-6 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_40%] gap-8 items-center">
            <div className="order-2 xl:order-1 min-w-0">
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-800">
                    Add Instagram account
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-md border border-gray-200 px-3 py-2 text-xs">
                    <p className="text-[10px] uppercase r text-gray-400">
                      Username
                    </p>
                    <p className="font-mono text-gray-900">
                      @growth.lab.io
                    </p>
                  </div>
                  <div className="rounded-md border border-gray-200 px-3 py-2 text-xs">
                    <p className="text-[10px] uppercase r text-gray-400">
                      Status
                    </p>
                    <p className="text-emerald-700 font-medium">Logged in</p>
                  </div>
                </div>
                <div className="rounded-md border border-gray-200 px-3 py-2 text-xs mb-2">
                  <p className="text-[10px] uppercase r text-gray-400">
                    Proxy
                  </p>
                  <p className="font-mono text-gray-900 truncate">
                    socks5://br-mobile-3:••••@proxy.example.com:1080
                  </p>
                </div>
                <p className="text-[10px] text-gray-500">
                  Each account runs in its own isolated Chromium profile.
                  Cookies, headers and IP never mix between accounts.
                </p>
              </div>
            </div>
            <div className="order-1 xl:order-2 xl:pl-4">
              <p className="text-sm uppercase st text-gray-400 mb-2">
                Step 2
              </p>
              <h3 className="text-3xl md:text-4xl text-white">
                Connect accounts &amp; assign proxies
              </h3>
              <p className="text-gray-300 mt-4">
                Add as many Instagram accounts as your plan allows. Optionally
                assign one HTTP or SOCKS5 proxy per account. MonchoOps logs in
                once, persists the session locally, and reuses it from then
                on — no constant relogins.
              </p>
            </div>
          </div>
        </div>

        <div
          data-step="3"
          className="rounded-lg bg-gray-100 p-6 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[40%_1fr] gap-8 items-center">
            <div className="order-1 xl:order-1 xl:pr-6">
              <p className="text-sm uppercase st text-gray-500 mb-2">
                Step 3
              </p>
              <h3 className="text-3xl md:text-4xl text-gray-900">
                Scrape, write variants, send
              </h3>
              <p className="text-gray-600 mt-4">
                Scrape qualified usernames from a competitor, hashtag, post
                or location. Save up to 20 message variants per group.
                Optionally have MonchoOps follow + like + watch a story on
                each target right before the DM, throttle the rate with
                jitter, and skip anyone you&apos;ve already DM&apos;d from
                that account.
              </p>
            </div>
            <div className="order-2 xl:order-2">
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4 max-w-lg ml-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="w-4 h-4 text-purple-700" />
                  <span className="text-sm font-semibold text-gray-800">
                    Cold DM — Tech Founders LATAM
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-3">
                  <div className="h-full w-[57%] bg-emerald-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-md bg-emerald-50 p-2">
                    <p className="font-semibold text-emerald-700">182</p>
                    <p className="text-[10px] text-emerald-700/70 uppercase r">
                      Sent
                    </p>
                  </div>
                  <div className="rounded-md bg-red-50 p-2">
                    <p className="font-semibold text-red-700">2</p>
                    <p className="text-[10px] text-red-700/70 uppercase r">
                      Failed
                    </p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-2">
                    <p className="font-semibold text-gray-700">136</p>
                    <p className="text-[10px] text-gray-500 uppercase r">
                      Pending
                    </p>
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
