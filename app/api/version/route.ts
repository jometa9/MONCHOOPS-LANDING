import { getAppSettings } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productKey = searchParams.get("productKey");

    const settings = await getAppSettings();

    if (productKey === "monchoops") {
      const version = settings.monchoopsVersion;
      return NextResponse.json({
        version,
        success: true,
      });
    }

    if (productKey !== null && productKey !== "") {
      return NextResponse.json(
        { error: "Invalid productKey. Only 'monchoops' is supported.", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      versions: {
        monchoops: {
          version: settings.monchoopsVersion,
        },
      },
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
