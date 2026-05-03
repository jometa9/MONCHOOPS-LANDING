import { NextRequest, NextResponse } from "next/server";
import { getUserByApiKey } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";

export function extractApiKey(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header) {
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1].trim();
  }
  const xKey = request.headers.get("x-api-key");
  if (xKey) return xKey.trim();
  const fromQuery = request.nextUrl.searchParams.get("apiKey");
  if (fromQuery) return fromQuery.trim();
  return null;
}

export async function authenticateApiKey(
  request: NextRequest
): Promise<{ user: User } | { error: NextResponse }> {
  const apiKey = extractApiKey(request);
  if (!apiKey) {
    return {
      error: NextResponse.json(
        { error: "Missing API key. Provide Authorization: Bearer <key>, x-api-key header, or ?apiKey=." },
        { status: 401 }
      ),
    };
  }
  const user = await getUserByApiKey(apiKey);
  if (!user) {
    return { error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) };
  }
  return { user };
}
