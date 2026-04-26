import {
  getAppSettings,
  getSubscriptionLimits,
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
    const subscriptionLimits = getSubscriptionLimits(settings);

    return NextResponse.json({
      monchoopsVersion: settings.monchoopsVersion,
      monchoopsWindowsDownloadUrl: settings.monchoopsWindowsDownloadUrl || "",
      monchoopsMacDownloadUrl: settings.monchoopsMacDownloadUrl || "",
      subscriptionLimits,
      resendApiKey: settings.resendApiKey || "",
      resendTestEmail: settings.resendTestEmail || "",
      emailFrom: settings.emailFrom || "",
      resendInboundWebhookSecret: settings.resendInboundWebhookSecret || "",
      discordWebhookUrl: settings.discordWebhookUrl || "",
      discordDailyReportWebhookUrl: settings.discordDailyReportWebhookUrl || "",
      openaiApiKey: settings.openaiApiKey || "",
      openaiModel: settings.openaiModel || "",
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
      subscriptionLimits,
      resendApiKey,
      resendTestEmail,
      emailFrom,
      resendInboundWebhookSecret,
      discordWebhookUrl,
      discordDailyReportWebhookUrl,
      openaiApiKey,
      openaiModel,
    } = body;

    let subscriptionLimitsJson: string | undefined;
    if (subscriptionLimits) {
      if (
        typeof subscriptionLimits === "object" &&
        subscriptionLimits.free &&
        subscriptionLimits.unlimited
      ) {
        if (!subscriptionLimits.pro) {
          subscriptionLimits.pro = { accountLimit: 8, fixedLotSize: null };
        }
        subscriptionLimitsJson = JSON.stringify(subscriptionLimits);
      } else {
        return NextResponse.json(
          {
            error:
              "Subscription limits must have free and unlimited plans",
          },
          { status: 400 }
        );
      }
    }

    const updateData: Parameters<typeof updateAppSettings>[1] = {
      monchoopsVersion: monchoopsVersion?.trim(),
      monchoopsWindowsDownloadUrl: monchoopsWindowsDownloadUrl?.trim(),
      monchoopsMacDownloadUrl: monchoopsMacDownloadUrl?.trim(),
      localCopierSubscriptionLimits: subscriptionLimitsJson,
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
    if (openaiApiKey !== undefined) {
      updateData.openaiApiKey = openaiApiKey?.trim() || null;
    }
    if (openaiModel !== undefined) {
      updateData.openaiModel = openaiModel?.trim() || null;
    }

    const { clearEmailConfigCache } = await import("@/lib/email/config");
    clearEmailConfigCache();

    const updatedSettings = await updateAppSettings(user.id, updateData);

    const updatedSubscriptionLimits = getSubscriptionLimits(updatedSettings);

    return NextResponse.json({
      success: true,
      monchoopsVersion: updatedSettings.monchoopsVersion,
      monchoopsWindowsDownloadUrl: updatedSettings.monchoopsWindowsDownloadUrl,
      monchoopsMacDownloadUrl: updatedSettings.monchoopsMacDownloadUrl,
      subscriptionLimits: updatedSubscriptionLimits,
      resendApiKey: updatedSettings.resendApiKey || "",
      resendTestEmail: updatedSettings.resendTestEmail || "",
      emailFrom: updatedSettings.emailFrom || "",
      resendInboundWebhookSecret: updatedSettings.resendInboundWebhookSecret || "",
      discordWebhookUrl: updatedSettings.discordWebhookUrl || "",
      discordDailyReportWebhookUrl: updatedSettings.discordDailyReportWebhookUrl || "",
      openaiApiKey: updatedSettings.openaiApiKey || "",
      openaiModel: updatedSettings.openaiModel || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
