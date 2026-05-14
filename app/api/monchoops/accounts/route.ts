import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countActiveInstagramAccounts,
  listActiveInstagramAccounts,
} from "@/lib/db/usage-queries";
import {
  getSubscriptionTier,
  getUserEntitlements,
} from "@/lib/db/queries";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const entitlements = await getUserEntitlements(user.id);
  const tier =
    user.role === "admin"
      ? "unlimited"
      : getSubscriptionTier(entitlements.monchoops);
  const limits = await limitsForTier(tier, user.role === "admin");

  const [accounts, used] = await Promise.all([
    listActiveInstagramAccounts(user.id),
    countActiveInstagramAccounts(user.id),
  ]);

  return NextResponse.json({
    plan: tier,
    limit: limits.accountLimit,
    used,
    remaining:
      limits.accountLimit == null
        ? null
        : Math.max(0, limits.accountLimit - used),
    accounts: accounts.map((a) => ({
      id: a.id,
      username: a.username,
      deviceId: a.deviceId,
      addedAt: a.addedAt.toISOString(),
    })),
  });
}
