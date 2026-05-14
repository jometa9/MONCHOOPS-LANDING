import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countActiveInstagramAccounts,
  unregisterInstagramAccount,
} from "@/lib/db/usage-queries";
import {
  getSubscriptionTier,
  getUserEntitlements,
} from "@/lib/db/queries";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

interface UnregisterBody {
  username?: unknown;
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: UnregisterBody;
  try {
    body = (await request.json()) as UnregisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const removed = await unregisterInstagramAccount(user.id, username);

  const entitlements = await getUserEntitlements(user.id);
  const tier =
    user.role === "admin"
      ? "unlimited"
      : getSubscriptionTier(entitlements.monchoops);
  const limits = await limitsForTier(tier, user.role === "admin");
  const used = await countActiveInstagramAccounts(user.id);

  return NextResponse.json({
    removed,
    plan: tier,
    limit: limits.accountLimit,
    used,
    remaining:
      limits.accountLimit == null
        ? null
        : Math.max(0, limits.accountLimit - used),
  });
}
