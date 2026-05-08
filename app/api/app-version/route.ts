import { getAppSettings } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({
      version: settings.monchoopsVersion,
      downloadUrls: {
        mac: settings.monchoopsMacDownloadUrl ?? "",
        windows: settings.monchoopsWindowsDownloadUrl ?? "",
      },
      extensionUrl: settings.monchoopsExtensionUrl ?? "",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
