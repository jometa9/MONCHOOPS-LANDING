"use client";

import { logoutAction } from "@/app/(login)/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export function DashboardNonAdminView() {
  const t = useTranslations("nonAdmin");

  async function handleLogout() {
    await logoutAction();
    await signOut({ callbackUrl: "/sign-in" });
  }

  return (
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
        <Link href="/">{t("goHome")}</Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        className="w-full justify-center rounded-lg border border-gray-300 py-3 text-md text-gray-700 hover:bg-gray-50"
      >
        {t("logout")}
      </Button>
      <p className="text-sm text-gray-600">
        {t("footer")}
      </p>
    </div>
  );
}
