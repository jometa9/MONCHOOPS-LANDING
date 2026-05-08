"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface AppSettingsState {
  monchoops: {
    version: string;
    windowsDownloadUrl: string;
    macDownloadUrl: string;
    extensionUrl: string;
  };
}

export default function AdminAppVersion() {
  const t = useTranslations("admin");
  const [settings, setSettings] = useState<AppSettingsState>({
    monchoops: {
      version: "",
      windowsDownloadUrl: "",
      macDownloadUrl: "",
      extensionUrl: "",
    },
  });
  const [originalSettings, setOriginalSettings] = useState<AppSettingsState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const loadCurrentSettings = async () => {
      try {
        const response = await fetch("/api/admin/app-settings");
        if (response.ok) {
          const data = await response.json();
          const newSettings: AppSettingsState = {
            monchoops: {
              version: data.monchoopsVersion || "1.0.0",
              windowsDownloadUrl: data.monchoopsWindowsDownloadUrl || "",
              macDownloadUrl: data.monchoopsMacDownloadUrl || "",
              extensionUrl: data.monchoopsExtensionUrl || "",
            },
          };
          setSettings(newSettings);
          setOriginalSettings(newSettings);
        }
      } catch {
      }
    };

    loadCurrentSettings();
  }, []);

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    setButtonStatus(null);

    try {
      const response = await fetch("/api/admin/app-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monchoopsVersion: settings.monchoops.version.trim(),
          monchoopsWindowsDownloadUrl: settings.monchoops.windowsDownloadUrl.trim(),
          monchoopsMacDownloadUrl: settings.monchoops.macDownloadUrl.trim(),
          monchoopsExtensionUrl: settings.monchoops.extensionUrl.trim(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setButtonStatus("success");
      setTimeout(() => setButtonStatus(null), 2000);
      setOriginalSettings(settings);
    } catch {
      setButtonStatus("error");
      setTimeout(() => setButtonStatus(null), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = originalSettings && JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const updateSetting = (
    field: "version" | "windowsDownloadUrl" | "macDownloadUrl" | "extensionUrl",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      monchoops: {
        ...prev.monchoops,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="multi-version" className="text-xs">{t("monchoopsVersion")}</Label>
            <Input
              id="multi-version"
              placeholder="1.0.0"
              value={settings.monchoops.version}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("version", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monchoops-win-url" className="text-xs">{t("monchoopsWinUrl")}</Label>
            <Input
              id="monchoops-win-url"
              placeholder="https://..."
              value={settings.monchoops.windowsDownloadUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("windowsDownloadUrl", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monchoops-mac-url" className="text-xs">{t("monchoopsMacUrl")}</Label>
            <Input
              id="monchoops-mac-url"
              placeholder="https://..."
              value={settings.monchoops.macDownloadUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("macDownloadUrl", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monchoops-extension-url" className="text-xs">{t("monchoopsExtensionUrl")}</Label>
            <Input
              id="monchoops-extension-url"
              placeholder="https://chromewebstore.google.com/..."
              value={settings.monchoops.extensionUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("extensionUrl", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
        </div>

      <Button
        onClick={handleUpdateSettings}
        disabled={isLoading || !hasChanges}
        className="w-full"
      >
        {isLoading
          ? t("updating")
          : buttonStatus === "success"
            ? t("success")
            : buttonStatus === "error"
              ? t("error")
              : t("updateAppSettings")}
      </Button>
    </div>
  );
}
