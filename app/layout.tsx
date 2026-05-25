import "@/app/globals.css";
import { MetaPixel } from "@/components/meta-pixel";
import { MetaPixelScript } from "@/components/meta-pixel-script";
import { Providers } from "@/components/providers";
import { getAppUrl } from "@/lib/app-url";
import { assetUrl } from "@/lib/asset-url";
import type { Metadata, Viewport } from "next";
import React from "react";

const metadataBaseUrl = getAppUrl();
const ICON = assetUrl("/assets/monchoops_square.png");
const PREVIEW = assetUrl("/assets/preview-home.png");

export const metadata: Metadata = {
  applicationName: "MonchoOps",
  icons: {
    icon: [{ url: ICON, type: "image/png" }],
    shortcut: [{ url: ICON, type: "image/png" }],
    apple: [{ url: ICON, type: "image/png" }],
  },
  title: "MonchoOps — Instagram cold DM automation, on your machine",
  description:
    "MonchoOps runs Instagram outreach from your computer. Multi-account, proxy-per-account, account warmup, lead scraping and cold DM campaigns — all isolated in their own Chromium and stored locally. Built for founders, agencies and creators who refuse to risk their accounts on cloud bots.",
  keywords: [
    "instagram dm automation",
    "instagram cold dm",
    "mass dm instagram",
    "instagram outreach tool",
    "instagram lead scraper",
    "instagram followers scraper",
    "instagram hashtag scraper",
    "instagram account warmup",
    "instagram multi-account manager",
    "proxy per instagram account",
    "instagram automation desktop app",
    "cold outreach instagram",
    "instagram b2b outreach",
    "instagram lead generation",
    "send dm to followers",
    "MonchoOps",
  ],
  authors: [
    {
      name: "Joaquin Metayer",
      url: "https://www.linkedin.com/in/joaquinmetayer/",
    },
  ],
  publisher: "MonchoOps",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(metadataBaseUrl),
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MonchoOps",
    url: "/",
    title: "MonchoOps — Instagram cold DM automation, on your machine",
    description:
      "Multi-account Instagram outreach from your own computer. Proxy-per-account, warmup, scraping and cold DM campaigns. No cloud, no shared IPs, no shared sessions.",
    images: [
      {
        url: PREVIEW,
        width: 1200,
        height: 630,
        alt: "MonchoOps — Instagram cold DM automation, on your machine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MonchoOps — Instagram cold DM automation, on your machine",
    description:
      "Multi-account Instagram outreach from your computer. Proxy-per-account, warmup, scraping, cold DMs. Built for accounts you can't afford to lose.",
    images: [PREVIEW],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

  return (
    <html lang="en" className="text-neutral-900">
      <body
        className="min-h-screen font-sans text-neutral-900 antialiased"
        suppressHydrationWarning={true}
      >
        {pixelId ? (
          <>
            <MetaPixelScript pixelId={pixelId} />
            <MetaPixel pixelId={pixelId} />
          </>
        ) : null}
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 w-full bg-white">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
