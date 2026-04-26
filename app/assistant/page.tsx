import { AIAssistantScreen } from "@/components/ai-assistant-screen";
import { LandingHeader } from "@/components/landing/landing-header";
import { StructuredData } from "@/components/structured-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  description:
    "Chat with Ugo, the MonchoOps AI assistant. Get instant answers about account warmup, scraping, cold DM campaigns and Instagram safety.",
  keywords: [
    "MonchoOps assistant",
    "MonchoOps help",
    "MonchoOps support",
    "MonchoOps chat",
    "Ugo AI",
  ],
  alternates: { canonical: "/assistant" },
  openGraph: {
    description:
      "Ask Ugo anything about MonchoOps — setup, warmup, proxies, scraping, or compliance.",
    url: "/assistant",
    type: "website",
    images: [
      { url: "/assets/preview-home.png", width: 1200, height: 630, alt: "MonchoOps AI Assistant" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description: "Ask Ugo, our MonchoOps AI assistant. Instant help for setup and outreach.",
  },
};

export default function PublicAssistantPage() {
  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{
          breadcrumb: {
            items: [
              { name: "Home", url: "/" },
              { name: "AI Assistant", url: "/assistant" },
            ],
          },
        }}
      />
      <StructuredData
        type="webpage"
        data={{
          webpage: {
            name: "MonchoOps - AI Assistant",
            description:
              "Chat with Ugo, the MonchoOps AI assistant. Get instant answers about setup, account warmup, scraping, and cold DMs.",
            url: "/assistant",
          },
        }}
      />
      <LandingHeader />
      <main className="pt-20 min-h-screen pb-0 md:pb-8 overflow-hidden">
        <div className="px-3 w-full chat-container-mobile">
          <AIAssistantScreen />
        </div>
      </main>
    </>
  );
}




