import { getAppUrl } from "@/lib/app-url";

export const seoConfig = {
  siteName: "MonchoOps",
  siteUrl: getAppUrl(),
  defaultTitle: "MonchoOps — Instagram cold DM automation, on your machine",
  defaultDescription:
    "MonchoOps runs Instagram outreach from your computer. Multi-account, proxy-per-account, account warmup, lead scraping and cold DM campaigns. No cloud bot, no shared IPs, no shared sessions.",

  primaryKeywords: [
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

  longTailKeywords: [
    "best instagram cold dm tool for agencies",
    "instagram outreach without getting banned",
    "instagram automation that runs locally",
    "scrape instagram followers and send dms",
    "instagram warmup for new accounts",
    "instagram dm tool with proxy support",
    "instagram lead scraper and dm sender",
    "send personalized instagram dms at scale",
    "multi account instagram desktop app",
    "instagram outreach for b2b sales",
    "secure instagram automation",
  ],

  social: {
    linkedin: "company/monchoops",
    instagram: "@monchoops",
  },

  creator: {
    name: "Joaquin Metayer",
    linkedin: "https://www.linkedin.com/in/joaquinmetayer/",
  },

  founder: {
    name: "Joaquin Metayer",
    linkedin: "https://www.linkedin.com/in/joaquinmetayer/",
  },

  contact: {
    email: "support@monchoops.com",
    address: "MONCHOOPS LLC",
  },

  pages: {
    home: {
      title: "MonchoOps — Instagram cold DM automation, on your machine",
      description:
        "Multi-account Instagram outreach from your computer. Proxy-per-account, isolated browsers, account warmup, lead scraping and cold DM campaigns. Free and Unlimited plans.",
      keywords: [
        "instagram dm automation",
        "instagram cold dm",
        "mass dm instagram",
        "instagram lead scraper",
        "instagram account warmup",
        "instagram multi account manager",
        "MonchoOps",
        "proxy per instagram account",
        "desktop instagram automation",
      ],
    },
    faqs: {
      title: "MonchoOps — Frequently asked questions",
      description:
        "Everything you need to know about MonchoOps: account warmup, proxies, scraping, cold DM campaigns, pricing, and Instagram safety.",
      keywords: [
        "MonchoOps documentation",
        "instagram dm setup guide",
        "instagram automation faq",
        "instagram warmup guide",
        "MonchoOps faqs",
        "cold dm best practices",
      ],
    },
    legal: {
      title: "MonchoOps — Legal",
      description:
        "Legal information for MonchoOps including terms of service and privacy policy for our Instagram outreach desktop app.",
      keywords: [
        "MonchoOps legal",
        "terms of service",
        "privacy policy",
        "instagram automation legal",
      ],
    },
  },
};

export function generatePageMetadata(page: keyof typeof seoConfig.pages) {
  const pageConfig = seoConfig.pages[page];

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      type: "website",
      url: `${seoConfig.siteUrl}/${page === "home" ? "" : page}`,
      siteName: seoConfig.siteName,
    },
  };
}
