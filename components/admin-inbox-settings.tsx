"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface EmailSettings {
  resendApiKey: string;
  emailFrom: string;
  resendInboundWebhookSecret: string;
  discordWebhookUrl: string;
  discordDailyReportWebhookUrl: string;
}

export default function AdminInboxSettings() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const [settings, setSettings] = useState<EmailSettings>({
    resendApiKey: "",
    emailFrom: "",
    resendInboundWebhookSecret: "",
    discordWebhookUrl: "",
    discordDailyReportWebhookUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [isRunningDailyReport, setIsRunningDailyReport] = useState(false);
  const [dailyReportFeedback, setDailyReportFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/app-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings({
          resendApiKey: data.resendApiKey || "",
          emailFrom: data.emailFrom || "",
          resendInboundWebhookSecret: data.resendInboundWebhookSecret || "",
          discordWebhookUrl: data.discordWebhookUrl || "",
          discordDailyReportWebhookUrl: data.discordDailyReportWebhookUrl || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/admin/app-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resendApiKey: settings.resendApiKey,
          emailFrom: settings.emailFrom,
          resendInboundWebhookSecret: settings.resendInboundWebhookSecret,
          discordWebhookUrl: settings.discordWebhookUrl,
          discordDailyReportWebhookUrl: settings.discordDailyReportWebhookUrl,
        }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunDailyReport = async () => {
    setDailyReportFeedback(null);
    setIsRunningDailyReport(true);
    try {
      const response = await fetch("/api/admin/run-daily-report", {
        method: "POST",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        skipped?: boolean;
        reason?: string;
        error?: string;
      };

      if (!response.ok) {
        setDailyReportFeedback({
          type: "error",
          text: data.error || t("reportCouldNotSend"),
        });
        return;
      }

      if (data.skipped) {
        const reason = data.reason || "";
        let text = reason;
        if (reason.includes("discordDailyReportWebhookUrl not configured")) {
          text = t("reportWebhookNotConfigured");
        } else if (
          reason.includes("Another instance") ||
          reason.includes("running")
        ) {
          text = t("reportAlreadyRunning");
        }
        setDailyReportFeedback({ type: "info", text });
        return;
      }

      setDailyReportFeedback({
        type: "success",
        text: t("reportSentDiscord"),
      });
    } catch {
      setDailyReportFeedback({
        type: "error",
        text: t("reportNetworkError"),
      });
    } finally {
      setIsRunningDailyReport(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="resend-api-key">{t("resendApiKey")}</Label>
        <div className="flex gap-3">
          <Input
            id="resend-api-key"
            type={showApiKey ? "text" : "password"}
            placeholder="re_..."
            value={settings.resendApiKey}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                resendApiKey: e.target.value,
              }))
            }
            className="bg-white shadow-none font-mono text-sm"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowApiKey(!showApiKey)}
            className="shadow-none whitespace-nowrap"
          >
            {showApiKey ? tCommon("hide") : tCommon("show")}
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          {t("resendApiKeyDesc")}
        </p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email-from">{t("defaultFromAddress")}</Label>
        <Input
          id="email-from"
          type="email"
          placeholder="noreply@monchoops.com"
          value={settings.emailFrom}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              emailFrom: e.target.value,
            }))
          }
          className="bg-white shadow-none"
        />
        <p className="text-xs text-gray-600">
          {t("defaultFromAddressDesc")}
        </p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="webhook-secret">{t("inboundWebhookSecret")}</Label>
        <div className="flex gap-3">
          <Input
            id="webhook-secret"
            type={showWebhookSecret ? "text" : "password"}
            placeholder="whsec_..."
            value={settings.resendInboundWebhookSecret}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                resendInboundWebhookSecret: e.target.value,
              }))
            }
            className="bg-white shadow-none font-mono text-sm"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowWebhookSecret(!showWebhookSecret)}
            className="shadow-none whitespace-nowrap"
          >
            {showWebhookSecret ? tCommon("hide") : tCommon("show")}
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          {t("inboundWebhookSecretDesc")}
        </p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="discord-webhook">{t("discordWebhookUrl")}</Label>
        <Input
          id="discord-webhook"
          type="url"
          placeholder="https://discord.com/api/webhooks/..."
          value={settings.discordWebhookUrl}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              discordWebhookUrl: e.target.value,
            }))
          }
          className="bg-white shadow-none font-mono text-sm"
        />
        <p className="text-xs text-gray-600">
          {t("discordWebhookUrlDesc")}
        </p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="discord-daily-report-webhook">
          {t("discordDailyReport")}
        </Label>
        <div className="flex gap-2 w-full items-center">
          <Input
            id="discord-daily-report-webhook"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={settings.discordDailyReportWebhookUrl}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                discordDailyReportWebhookUrl: e.target.value,
              }))
            }
            className="bg-white shadow-none font-mono text-sm flex-1 min-w-0"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleRunDailyReport}
            disabled={isRunningDailyReport}
            className="shrink-0 shadow-none whitespace-nowrap"
          >
            {isRunningDailyReport ? "…" : t("runReport")}
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          {t("discordDailyReportDesc")}
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving
          ? tCommon("saving")
          : saveStatus === "success"
            ? t("saved")
            : saveStatus === "error"
              ? t("error")
              : t("saveSettings")}
      </Button>
    </div>
  );
}
