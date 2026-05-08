"use client";

import { DashboardBrandFooter } from "@/components/dashboard-brand-footer";
import { DashboardProductsOverview } from "@/components/dashboard-products-overview";
import { useUserData } from "@/contexts/user-data-context";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data } = useUserData();

  const userName = data?.name || data?.email?.split("@")[0] || t("welcomeFallback");

  return (
    <div className="px-3 w-full pb-20">
      <div className="w-full  space-y-3">
        <div>
          <h1 className="text-2xl">{t("welcomeBack", { name: userName })}</h1>
          <p className="text-gray-600 text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>

        <DashboardProductsOverview />

      </div>
    </div>
  );
}
