import {
  getAppSettings,
  getUser,
  updateAppSettings,
} from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getAppSettings();

    return NextResponse.json({
      monchoopsVersion: settings.monchoopsVersion,
      monchoopsWindowsDownloadUrl: settings.monchoopsWindowsDownloadUrl || "",
      monchoopsMacDownloadUrl: settings.monchoopsMacDownloadUrl || "",
      monchoopsExtensionUrl: settings.monchoopsExtensionUrl || "",
      resendApiKey: settings.resendApiKey || "",
      resendTestEmail: settings.resendTestEmail || "",
      emailFrom: settings.emailFrom || "",
      resendInboundWebhookSecret: settings.resendInboundWebhookSecret || "",
      discordWebhookUrl: settings.discordWebhookUrl || "",
      discordDailyReportWebhookUrl: settings.discordDailyReportWebhookUrl || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      monchoopsVersion,
      monchoopsWindowsDownloadUrl,
      monchoopsMacDownloadUrl,
      monchoopsExtensionUrl,
      resendApiKey,
      resendTestEmail,
      emailFrom,
      resendInboundWebhookSecret,
      discordWebhookUrl,
      discordDailyReportWebhookUrl,
    } = body;

    const updateData: Parameters<typeof updateAppSettings>[1] = {
      monchoopsVersion: monchoopsVersion?.trim(),
      monchoopsWindowsDownloadUrl: monchoopsWindowsDownloadUrl?.trim(),
      monchoopsMacDownloadUrl: monchoopsMacDownloadUrl?.trim(),
      monchoopsExtensionUrl: monchoopsExtensionUrl?.trim(),
    };

    if (resendApiKey !== undefined) {
      updateData.resendApiKey = resendApiKey?.trim() || null;
    }
    if (resendTestEmail !== undefined) {
      updateData.resendTestEmail = resendTestEmail?.trim() || null;
    }
    if (emailFrom !== undefined) {
      updateData.emailFrom = emailFrom?.trim() || null;
    }
    if (resendInboundWebhookSecret !== undefined) {
      updateData.resendInboundWebhookSecret = resendInboundWebhookSecret?.trim() || null;
    }
    if (discordWebhookUrl !== undefined) {
      updateData.discordWebhookUrl = discordWebhookUrl?.trim() || null;
    }
    if (discordDailyReportWebhookUrl !== undefined) {
      updateData.discordDailyReportWebhookUrl =
        discordDailyReportWebhookUrl?.trim() || null;
    }
    const { clearEmailConfigCache } = await import("@/lib/email/config");
    clearEmailConfigCache();

    const updatedSettings = await updateAppSettings(user.id, updateData);

    return NextResponse.json({
      success: true,
      monchoopsVersion: updatedSettings.monchoopsVersion,
      monchoopsWindowsDownloadUrl: updatedSettings.monchoopsWindowsDownloadUrl,
      monchoopsMacDownloadUrl: updatedSettings.monchoopsMacDownloadUrl,
      monchoopsExtensionUrl: updatedSettings.monchoopsExtensionUrl || "",
      resendApiKey: updatedSettings.resendApiKey || "",
      resendTestEmail: updatedSettings.resendTestEmail || "",
      emailFrom: updatedSettings.emailFrom || "",
      resendInboundWebhookSecret: updatedSettings.resendInboundWebhookSecret || "",
      discordWebhookUrl: updatedSettings.discordWebhookUrl || "",
      discordDailyReportWebhookUrl: updatedSettings.discordDailyReportWebhookUrl || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
