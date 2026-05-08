import { PricingSection } from "@/components/pricing-section";
import { getCurrentUserFromSession } from "@/lib/db/queries";
import { paymentsEnabled } from "@/lib/payments/feature-flag";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect("/sign-in");
  }
  if (!paymentsEnabled) {
    redirect("/dashboard");
  }

  const t = await getTranslations("pricing");

  return (
    <div className="px-3 w-full pb-20">
        <h1 className="text-2xl">{t("dashboardTitle")}</h1>
        <p className=" text-gray-600 text-sm max-w-2xl pt-1">
          {t("dashboardSubtitle")}
        </p>

      <PricingSection user={user} isCompact={true} />
    </div>
  );
}
