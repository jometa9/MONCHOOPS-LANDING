"use client";

import { LicenseKeyCard } from "@/components/license-key-card";
import { WindowsIcon } from "@/components/icons/windows-icon";
import { MacOSIcon } from "@/components/icons/macos-icon";
import { useUserData } from "@/contexts/user-data-context";
import {
  fetchAppVersion,
  handleDownload as doDownload,
  type DownloadOS,
} from "@/lib/download-handler";
import { ChromeIcon } from "@/components/icons/chrome-icon";
import { ProductKey } from "@/lib/db/schema";
import { paymentsEnabled } from "@/lib/payments/feature-flag";
import { customerPortalAction } from "@/lib/payments/actions";
import {
  ArrowDownToLine,
  Blocks,
  Book,
  BookOpen,
  Download,
  ExternalLink,
  Mail,
  PartyPopper,
  Youtube,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useMailtoCopy } from "@/hooks/use-mailto-copy";

const SUPPORT_EMAIL = "support@monchoops.com";

interface AppVersionInfo {
  version: string;
  downloadUrls: { mac: string; windows: string };
  extensionUrl: string;
}

export function DashboardProductsOverview() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { data, user, isLoading } = useUserData();
  const { copied, handleClick } = useMailtoCopy(SUPPORT_EMAIL);
  const [isPortalLoading, setIsPortalLoading] = useState<"monchoops" | null>(null);
  const [downloads, setDownloads] = useState<AppVersionInfo | null>(null);
  const windowsDemoUrl = "https://www.youtube.com/watch?v=lpPXse5LJSg";

  const isAdmin = user?.role === "admin" || data?.isAdmin || false;
  const entitlements = data?.entitlements;

  useEffect(() => {
    const loadDownloads = async () => {
      const d = await fetchAppVersion();
      setDownloads(d);
    };
    loadDownloads();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("statusActive");
      case "trialing":
        return t("statusTrial");
      case "canceled":
      case "canceling":
        return t("statusCanceled");
      case "past_due":
        return t("statusPastDue");
      case "admin_assigned":
        return t("statusAdminAssigned");
      case "expired":
        return t("statusExpired");
      default:
        return t("statusNone");
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "unlimited":
        return t("tierUnlimited");
      case "pro":
        return t("tierPro");
      default:
        return t("tierFree");
    }
  };

  const handleSubscribe = useCallback(() => {
    router.push("/dashboard/pricing");
  }, [router]);

  const handlePortalRedirect = useCallback(
    async (productKey: "monchoops") => {
      setIsPortalLoading(productKey);
      try {
        const result = await customerPortalAction(productKey);
        if (result?.redirect) {
          window.location.href = result.redirect;
        }
      } finally {
        setIsPortalLoading(null);
      }
    },
    []
  );

  const hasDownloadUrl = useCallback(
    (productKey: ProductKey, os: DownloadOS): boolean => {
      if (!downloads || productKey !== "monchoops") return false;
      return os === "mac"
        ? !!downloads.downloadUrls?.mac
        : !!downloads.downloadUrls?.windows;
    },
    [downloads]
  );

  const handleDownloadClick = useCallback(
    async (productKey: ProductKey, os: DownloadOS) => {
      if (!hasDownloadUrl(productKey, os)) return;
      await doDownload(productKey, os);
    },
    [hasDownloadUrl]
  );

  const intlLocale = locale === "es" ? "es-ES" : "en-US";
  const formatDate = (date: Date) =>
    date.toLocaleDateString(intlLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-white p-3 h-48"></div>
            <div className="rounded-lg bg-white p-3 h-32"></div>
          </div>
        </div>
      </div>
    );
  }

  const subscription = entitlements?.monchoops;
  const planLimits = subscription?.limits;
  const planUsage = subscription?.usage;
  const formatLimit = (used: number, limit: number | null | undefined) => {
    if (isAdmin || limit == null) return `${used.toLocaleString(intlLocale)}${t("unlimitedSlash")}`;
    return `${used.toLocaleString(intlLocale)} / ${limit.toLocaleString(intlLocale)}`;
  };
  const hasActiveSubscription = subscription?.active || isAdmin;
  const hasSubscription = subscription !== null;
  const hasExpirationDate = subscription?.expiresAt != null;
  const isAdminAssigned = subscription?.status === "admin_assigned";
  const isCanceled = subscription?.status === "canceled";
  const isCanceling = subscription?.status === "canceling";

  const displayLabel = isAdmin
    ? t("unlimited")
    : hasActiveSubscription
      ? getTierLabel(subscription?.tier || "free")
      : hasSubscription || hasExpirationDate
        ? getStatusLabel(subscription?.status || "none")
        : t("tierFree");

  const cardWrapper = "rounded-lg bg-gray-100 p-3";
  const cardInner = "rounded-lg bg-white p-3 border border-gray-200";

  return (
    <div className="space-y-3">
      {!paymentsEnabled && (
        <div className={cardWrapper}>
          <div className={cardInner}>
            <div className="flex flex-col mb-1">
              <div className="flex gap-2 items-center pb-1">
                <PartyPopper className="h-5 w-5 text-yellow-700" />
                <p className="text-lg text-yellow-700">{t("openBeta")}</p>
              </div>
              <p className="text-xs mb-1 text-yellow-700">
                {t("openBeta1")}
              </p>
              <p className="text-xs mb-1 text-yellow-700">
                {t("openBeta2")}
              </p>
              <p className="text-xs text-yellow-700">
                {t("openBeta3")}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className={cardWrapper}>
        <div className={cardInner}>
          <div className="flex flex-col mb-2">
            <div className="flex gap-2 items-center pb-1">
              <Blocks className="h-5 w-5" />
              <p className="text-lg text-gray-700">MonchoOps</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("platforms")}
            </p>
            <p className="text-xl font-semibold">{displayLabel}</p>
            {!isAdmin && (
              <>
                <p className="text-xs text-muted-foreground">
                  {t("status")} {getStatusLabel(subscription?.status || "none")}
                </p>
                {subscription?.billingPeriod && (
                  <p className="text-xs text-muted-foreground">
                    {t("billing")}{" "}
                    {subscription.billingPeriod === "annual" ? t("billingAnnual") : t("billingMonthly")}
                  </p>
                )}
                {subscription?.expiresAt && (
                  <p className="text-xs text-muted-foreground">
                    {(subscription.status === "canceling" ||
                      (subscription.status === "canceled" &&
                        new Date(subscription.expiresAt) > new Date()))
                      ? t("validUntil")
                      : hasActiveSubscription
                        ? t("renews")
                        : t("expires")}
                    {formatDate(new Date(subscription.expiresAt))}
                  </p>
                )}
              </>
            )}
            {isAdmin && (
              <p className="text-xs text-muted-foreground">{t("adminAccess")}</p>
            )}
          </div>

          {planUsage && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-2">
                {t("planUsage")}{" "}
                {planLimits?.dmMonthlyLimit != null && !isAdmin
                  ? t("resetsMonthly")
                  : ""}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">{t("instagramAccounts")}</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatLimit(planUsage.accounts, planLimits?.accountLimit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("dmsThisMonth")}</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatLimit(
                      planUsage.dmsThisMonth,
                      planLimits?.dmMonthlyLimit
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!paymentsEnabled ? (
            <button
              type="button"
              disabled
              className="mt-1 rounded-full border border-gray-300 bg-gray-100 py-1 px-3 text-sm text-gray-500 cursor-default text-center"
            >
              {t("paymentsDisabled")}
            </button>
          ) : isAdmin ? (
            <button
              type="button"
              disabled
              className="mt-1 rounded-full border border-gray-300 bg-gray-100 py-1 px-3 text-sm text-gray-500 cursor-default text-center"
            >
              {t("youAreTheBoss")}
            </button>
          ) : isAdminAssigned ? (
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 mt-1">
              <p className="text-sm text-gray-600">
                {t("planAssignedByAdmin")}
                {subscription?.expiresAt && (
                  <span>
                    {t("planAssignedValid", { date: formatDate(new Date(subscription.expiresAt)) })}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("contactAdmin")}
              </p>
            </div>
          ) : hasActiveSubscription ? (
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              {isCanceling ? (
                <>
                  <button
                    type="button"
                    onClick={() => handlePortalRedirect("monchoops")}
                    className="cursor-pointer rounded-full text-white bg-black py-1 px-3 text-sm hover:bg-gray-600 text-center"
                  >
                    {isPortalLoading === "monchoops" ? t("openingDots") : t("reactivate")}
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border bg-white py-1 px-3 text-sm hover:bg-gray-100 text-center"
                    onClick={handleSubscribe}
                  >
                    {t("changePlan")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full text-white bg-black py-1 px-3 text-sm hover:bg-gray-600 text-center"
                    onClick={handleSubscribe}
                  >
                    {t("changePlan")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePortalRedirect("monchoops")}
                    className="cursor-pointer rounded-full border bg-white py-1 px-3 text-sm hover:bg-gray-100 text-center"
                  >
                    {isPortalLoading === "monchoops" ? t("openingDots") : t("manage")}
                  </button>
                </>
              )}
            </div>
          ) : isCanceled && hasSubscription ? (
            <button
              type="button"
              className="cursor-pointer rounded-full text-white bg-black py-1 px-3 text-sm hover:bg-gray-600 text-center inline-block mt-1"
              onClick={handleSubscribe}
            >
              {t("resubscribe")}
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer rounded-full text-white bg-black py-1 px-3 text-sm hover:bg-gray-600 text-center inline-block mt-1"
              onClick={handleSubscribe}
            >
              {t("subscribe")}
            </button>
          )}
        </div>
      </div>
      <div className={cardWrapper}>
        <div className={cardInner}>
          <div className="flex flex-col mb-2">
            <div className="flex gap-2 items-center pb-1">
              <Download className="h-5 w-5 text-gray-700" />
              <p className="text-lg text-gray-700">{t("downloadTitle")}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {t("availableForOs")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              className={`rounded-lg border cursor-pointer border-gray-200 transition-all px-4 py-3 ${hasDownloadUrl("monchoops", "windows")
                ? "hover:bg-white cursor-pointer bg-gray-50"
                : "opacity-60 cursor-default bg-gray-50"
                }`}
              onClick={() => handleDownloadClick("monchoops", "windows")}
            >
              <div className="flex  items-end justify-between">
                <div className="flex gap-2 flex-col">
                  <div className="flex gap-2 items-center">
                    <WindowsIcon className="h-5 w-5 text-gray-800" />
                    <p className="text-lg text-gray-700">
                      {t("windows64")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("version", { version: downloads?.version || "—" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("multiAccountAutomation")}
                    </p>
                  </div>
                </div>
                <ArrowDownToLine className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            <div
              className={`rounded-lg border cursor-pointer border-gray-200 transition-all px-4 py-3 ${hasDownloadUrl("monchoops", "mac")
                ? "hover:bg-white cursor-pointer bg-gray-50"
                : "opacity-60 cursor-default bg-gray-50"
                }`}
              onClick={() => handleDownloadClick("monchoops", "mac")}
            >
              <div className="flex items-end justify-between">
                <div className="flex gap-2 flex-col">

                  <div className="flex gap-2 items-center">
                    <MacOSIcon className="h-5 w-5 text-gray-800" />
                    <p className="text-lg text-gray-700">
                      {t("macArm64")}
                    </p>

                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("version", { version: downloads?.version || "—" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("multiAccountAutomation")}
                    </p>
                  </div>
                </div>

                <ArrowDownToLine className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
          {downloads?.extensionUrl ? (
            <a
              href={downloads.extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block rounded-lg border border-gray-200 bg-gray-50 hover:bg-white transition-all px-4 py-3"
            >
              <div className="flex items-end justify-between gap-3">
                <div className="flex gap-2 flex-col min-w-0">
                  <div className="flex gap-2 items-center">
                    <ChromeIcon className="h-5 w-5" />
                    <p className="text-lg text-gray-700">
                      {t("chromeExtensionTitle")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("chromeExtensionDesc")}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-700 shrink-0" />
              </div>
            </a>
          ) : null}
          <div className="mt-4 px-1 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3">
            <Link
              href="/dashboard/documentation#installation-and-demo"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={true}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-black transition-colors w-fit"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>
                {t("firstTimeSetup")}
                {` `}
                <span className="underline">{t("here")}</span>
              </span>
            </Link>
            <a
              href={windowsDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-black transition-colors w-fit"
            >
              <Youtube className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-black transition-colors sm:order-2" />
              <span className="sm:order-1">{t("watchDemo")}</span>
            </a>
          </div>
        </div>
      </div>
      <div className={cardWrapper}>
        <div className={cardInner}>
          <LicenseKeyCard user={user} />
        </div>
      </div>

      <div className="rounded-lg bg-gray-100 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Link
            href="/dashboard/documentation"
            prefetch={true}
            className="group rounded-lg bg-white p-3 px-4 border border-gray-200 hover:bg-gray-50 cursor-pointer block transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-col">
                <div className="flex items-center justify-center gap-2">
                  <Book className="w-5 h-5  text-gray-700" />
                  <p className="text-lg">{t("documentation")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("documentationDesc")}</p>
                </div>
              </div>
            </div>
          </Link>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            onClick={handleClick}
            className="group rounded-lg bg-white p-3 px-4 border border-gray-200 hover:bg-gray-50 cursor-pointer block transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-col">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5 text-gray-700" />
                  <p className="text-lg">{t("emailSupport")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {copied ? tCommon("copied") : t("getInTouch")}
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
