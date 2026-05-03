"use client";

import { MacOSIcon } from "@/components/icons/macos-icon";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { ArrowDownToLine, BlocksIcon, Check } from "lucide-react";
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
    "Multi-account workflow with isolated Chromium profile per account",
    "One HTTP or SOCKS5 proxy per account, persisted in the local DB",
    "4 scraping modes — username, post, hashtag, location",
    "Cold DM with up to 20 message variants per group",
    "Optional pre-DM interactions: follow + likes + story view before each send",
    "Auto-skip prospects you've already DM'd, even months later",
    "Live job queue with progress and one-click cancel",
  ];

  return (
    <section className="py-24" id="products">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">The desktop app</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          One installer. Scrape, send, track. Done.
        </h2>

        <div className="bg-gray-100 rounded-lg p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-8">
            <div className="flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center gap-2 h-12 w-12 rounded-lg bg-white border border-gray-200 overflow-hidden">
                    <Image
                      src="/monchoops-icon.png"
                      alt="MonchoOps"
                      width={36}
                      height={36}
                      className="h-9 w-9"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold">MonchoOps</h3>
                    <p className="text text-gray-500">Windows and macOS</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                  A native desktop app that handles the parts of Instagram
                  outreach that should never have been in the cloud:
                  authentication, sessions, proxies, scraping and DM
                  sending. Local SQLite, encrypted cookies, bundled
                  Chromium. The cloud middleman is gone.
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
                          Download for Windows 64-bit
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
                          Download for macOS Apple Silicon
                        </p>
                      </div>
                      <ArrowDownToLine className="h-4 w-4 text-gray-700" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative h-full min-h-[260px] md:min-h-0 overflow-hidden rounded-lg border border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BlocksIcon className="h-72 w-72 text-white opacity-40" />
              </div>
              <div className="relative z-10 px-6 py-8 max-w-md text-center">
                <Image
                  src="/monchoops-icon.png"
                  alt="MonchoOps"
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-2xl shadow-xl"
                />
                <p className="mt-6 text-2xl font-semibold text-gray-900">
                  MonchoOps for Desktop
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  ~250&nbsp;MB · Native installer · Works offline once set up
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
