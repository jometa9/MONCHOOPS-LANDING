import {
  extractClientInfo,
  extractFacebookCookies,
  trackLead,
} from "@/lib/meta";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const os = body?.os === "mac" ? "mac" : "windows";
    const metaEventId =
      typeof body?.metaEventId === "string" ? body.metaEventId : undefined;

    const { fbc, fbp } = extractFacebookCookies(request);
    const { clientIpAddress, clientUserAgent } = extractClientInfo(request);
    await trackLead({
      contentName: `MonchoOps MULTI Download`,
      contentCategory: "app_download",
      eventSourceUrl: request.url,
      eventId: metaEventId,
      clientIpAddress,
      clientUserAgent,
      fbc,
      fbp,
    });

    return NextResponse.json({ success: true, os });
  } catch (error) {
    console.error("[TrackDownload] Meta Conversions API Lead:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
