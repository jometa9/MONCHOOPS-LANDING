import { getAppUrl } from "@/lib/app-url";
import Script from "next/script";

export type StructuredDataType =
  | "organization"
  | "software"
  | "product"
  | "faq"
  | "breadcrumb"
  | "webpage"
  | "website";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface WebPageData {
  name: string;
  description: string;
  url: string;
}

interface StructuredDataProps {
  type: StructuredDataType;
  data?: {
    breadcrumb?: { items: BreadcrumbItem[] };
    webpage?: WebPageData;
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = getAppUrl();

  const toAbsolute = (path: string) =>
    path.startsWith("http")
      ? path
      : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const description =
    "MonchoOps runs Instagram outreach from your computer. Multi-account, proxy-per-account, account warmup, lead scraping and cold DM campaigns — all on hardware you own.";

  const getStructuredData = (): object | null => {
    switch (type) {
      case "breadcrumb": {
        const items = data?.breadcrumb?.items ?? [];
        if (items.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: toAbsolute(item.url),
          })),
        };
      }
      case "webpage": {
        const page = data?.webpage;
        if (!page) return null;
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.name,
          description: page.description,
          url: toAbsolute(page.url),
          isPartOf: {
            "@type": "WebSite",
            name: "MonchoOps",
            url: baseUrl,
          },
        };
      }
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MonchoOps",
          url: baseUrl,
          description,
          publisher: {
            "@type": "Organization",
            name: "MonchoOps",
            logo: `${baseUrl}/monchoops-icon.png`,
          },
          inLanguage: "en-US",
        };
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MonchoOps",
          url: baseUrl,
          logo: `${baseUrl}/monchoops-icon.png`,
          description,
          foundingDate: "2026",
          sameAs: [
            "https://www.instagram.com/monchoops",
            "https://www.linkedin.com/company/monchoops",
          ],
        };

      case "software":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "MonchoOps",
          applicationCategory: "BusinessApplication",
          operatingSystem: ["Windows", "macOS"],
          description,
          url: baseUrl,
          author: {
            "@type": "Organization",
            name: "MonchoOps",
          },
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              description: "1 Instagram account, 100 DMs / month",
            },
            {
              "@type": "Offer",
              name: "Pro",
              price: "29",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              description:
                "5 Instagram accounts, 5,000 DMs / month, full warmup, scraping and message variants",
            },
            {
              "@type": "Offer",
              name: "Unlimited",
              price: "79",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              description:
                "Unlimited Instagram accounts, scrapes, and DMs",
            },
          ],
          screenshot: `${baseUrl}/assets/preview-home.png`,
        };

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "MonchoOps",
          description,
          brand: {
            "@type": "Brand",
            name: "MonchoOps",
          },
          category: "Instagram outreach automation",
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              description: "1 Instagram account, 100 DMs / month",
            },
            {
              "@type": "Offer",
              name: "Unlimited",
              price: "79",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              description:
                "Unlimited Instagram accounts, scrapes, and DMs",
            },
          ],
        };

      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is MonchoOps?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "MonchoOps is a desktop app for Instagram outreach. You add one or more Instagram accounts, optionally assign a proxy to each, and run scrapes, account warmup and cold DM campaigns from your own computer. Everything is stored locally in an encrypted database.",
              },
            },
            {
              "@type": "Question",
              name: "Does it run on Windows and Mac?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. MonchoOps ships as a native Electron app for Windows (x64) and macOS (Apple Silicon). Same features on both platforms.",
              },
            },
            {
              "@type": "Question",
              name: "Is it safe for my Instagram accounts?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "MonchoOps gives you proxy-per-account, isolated Chromium profiles, randomized delays, multi-day account warmup and throttled DM sends. Automation always carries some risk on Instagram — MonchoOps minimizes the obvious red flags but you remain responsible for how aggressively you push.",
              },
            },
            {
              "@type": "Question",
              name: "How many Instagram accounts can I run?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Free: 1 account, 100 DMs/month. Pro: 5 accounts, 5,000 DMs/month. Unlimited: unlimited accounts and DMs.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need proxies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Strongly recommended for any account you care about, and required for more than 2-3 accounts. Bring your own HTTP or SOCKS5 proxies; MonchoOps assigns one per account.",
              },
            },
            {
              "@type": "Question",
              name: "Why is local better than a cloud DM tool?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Cloud DM tools share IPs and store your sessions on their servers. Instagram pattern-matches that. MonchoOps runs on your machine with your IP and keeps the data encrypted on your disk.",
              },
            },
          ],
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
