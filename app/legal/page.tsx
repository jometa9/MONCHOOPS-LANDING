import { LandingHeader } from "@/components/landing/landing-header";
import { MailtoLink } from "@/components/mailto-link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { StructuredData } from "@/components/structured-data";
import type { Metadata } from "next";
import { readFileSync } from "fs";
import { getTranslations } from "next-intl/server";
import { join } from "path";

export const metadata: Metadata = {
  description:
    "Legal documentation for MonchoOps: Privacy Policy, Terms of Use, Cookie Policy, Billing, Complaints, Refund Policy and Disclaimer. Read our policies.",
  keywords: [
    "MonchoOps legal",
    "MonchoOps privacy policy",
    "MonchoOps terms of use",
    "instagram automation terms",
    "MonchoOps refund policy",
  ],
  alternates: { canonical: "/legal" },
  openGraph: {
    description:
      "Privacy Policy, Terms of Use, Cookie Policy, Billing, Complaints, Refunds and Disclaimer for MonchoOps.",
    url: "/legal",
    type: "website",
    images: [
      { url: "/assets/preview-home.png", width: 1200, height: 630, alt: "MonchoOps Legal" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description: "Privacy Policy, Terms of Use, Cookie Policy and more for MonchoOps.",
  },
};

export default async function LegalPage() {
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  const documents = [
    { id: "cookies", title: t("docs.cookies"), filename: "cookies.md" },
    { id: "privacy", title: t("docs.privacy"), filename: "privacy.md" },
    { id: "terms", title: t("docs.terms"), filename: "terms.md" },
    { id: "billing", title: t("docs.billing"), filename: "billing.md" },
    { id: "complaints", title: t("docs.complaints"), filename: "complaints.md" },
    { id: "refunds", title: t("docs.refunds"), filename: "refunds.md" },
    { id: "disclaimer", title: t("docs.disclaimer"), filename: "disclaimer.md" },
  ];

  const contents: Record<string, string> = {};

  for (const doc of documents) {
    try {
      const filePath = join(process.cwd(), "public", doc.filename);
      contents[doc.id] = readFileSync(filePath, "utf-8");
    } catch (error) {
      console.error(`Error reading ${doc.filename}:`, error);
      contents[doc.id] = `# ${doc.title}\n\nThe \`${doc.filename}\` file was not found.`;
    }
  }

  const legalDocsUpdated = "February 2026";

  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{
          breadcrumb: {
            items: [
              { name: "Home", url: "/" },
              { name: "Legal", url: "/legal" },
            ],
          },
        }}
      />
      <StructuredData
        type="webpage"
        data={{
          webpage: {
            name: "MonchoOps - Legal",
            description:
              "Legal documentation for MonchoOps: Privacy Policy, Terms of Use, Cookie Policy, Billing, Complaints, Refund Policy and Disclaimer.",
            url: "/legal",
          },
        }}
      />
      <LandingHeader />
      <main className="pt-25 pb-20">
        <div className="px-3 w-full max-w-7xl mx-auto">
          <div className="w-full space-y-4 pb-8">
            <div className="max-w-4xl pb-0">
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-3 text-gray-600 text-2xl max-w-2xl">
                {t("subtitle")}
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                {t("lastUpdated", { date: legalDocsUpdated })}
              </p>
            </div>

            <div className="max-w-4xl my-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("tableOfContents")}</h2>
              <ul className="space-y-2 pl-3">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={`#${doc.id}`}
                      className="text-gray-400 hover:text-gray-600 hover:underline"
                    >
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border-gray-200 my-8 max-w-4xl" />

            {documents.map((doc, index) => (
              <div key={doc.id}>
                {index > 0 && <hr className="border-gray-200 my-8 max-w-4xl" />}
                <div id={doc.id} className="scroll-mt-20 max-w-4xl">
                  <MarkdownRenderer content={contents[doc.id] || ""} />
                </div>
              </div>
            ))}

            <hr className="border-gray-200 my-8 max-w-4xl" />
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("contactUs")}</h2>
              <p className="text-gray-600 mb-4">
                {t("contactBody")}
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>{t("emailLabel")}</strong>{" "}
                  <MailtoLink
                    label="support@monchoops.com"
                    copiedLabel={tCommon("copied")}
                  />
                </p>
                <p>
                  <strong>{t("websiteLabel")}</strong> https://monchoops.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
