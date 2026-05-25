import { LandingHeader } from "@/components/landing/landing-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  description:
    "The page you are looking for does not exist. Return to MonchoOps – Instagram cold DM automation, on your machine.",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <LandingHeader />
      <div className="flex min-h-screen flex-col items-center justify-center px-3 py-12 pt-28">
        <div className="flex w-full max-w-md flex-col items-stretch">
          <div className="space-y-3 pb-20">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("title")}
              </h2>
              <p className="text-xl text-gray-400">
                {t("subtitle")}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {t("body")}
            </p>
            <Button
              asChild
              className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600"
            >
              <Link href="/">{t("button")}</Link>
            </Button>
            <p className="text-sm text-gray-600">
              {t("footer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
