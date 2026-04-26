"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface AppSettingsState {
  monchoops: {
    version: string;
    windowsDownloadUrl: string;
    macDownloadUrl: string;
  };
}

export default function AdminAppVersion() {
  const [settings, setSettings] = useState<AppSettingsState>({
    monchoops: {
      version: "",
      windowsDownloadUrl: "",
      macDownloadUrl: "",
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
      const getResponse = await fetch("/api/admin/app-settings");
      const currentData = await getResponse.json();

      const response = await fetch("/api/admin/app-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monchoopsVersion: settings.monchoops.version.trim(),
          monchoopsWindowsDownloadUrl: settings.monchoops.windowsDownloadUrl.trim(),
          monchoopsMacDownloadUrl: settings.monchoops.macDownloadUrl.trim(),
          subscriptionLimits: currentData.subscriptionLimits,
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
    field: "version" | "windowsDownloadUrl" | "macDownloadUrl",
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
            <Label htmlFor="multi-version" className="text-xs">MonchoOps Version</Label>
            <Input
              id="multi-version"
              placeholder="1.0.0"
              value={settings.monchoops.version}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("version", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monchoops-win-url" className="text-xs">MonchoOps Windows Download URL</Label>
            <Input
              id="monchoops-win-url"
              placeholder="https://..."
              value={settings.monchoops.windowsDownloadUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("windowsDownloadUrl", e.target.value)}
              className="shadow-none bg-white text-sm"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monchoops-mac-url" className="text-xs">MonchoOps macOS Download URL</Label>
            <Input
              id="monchoops-mac-url"
              placeholder="https://..."
              value={settings.monchoops.macDownloadUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting("macDownloadUrl", e.target.value)}
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
          ? "Updating..."
          : buttonStatus === "success"
            ? "Success"
            : buttonStatus === "error"
              ? "Error"
              : "Update App Settings"}
      </Button>
    </div>
  );
}
