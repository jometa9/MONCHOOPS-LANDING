import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countActiveInstagramAccounts,
  countDmsThisMonth,
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
  const limits = limitsForTier(tier, user.role === "admin");

  const [accountUsage, dmUsage] = await Promise.all([
    countActiveInstagramAccounts(user.id),
    countDmsThisMonth(user.id),
  ]);

  return NextResponse.json({
    plan: tier,
    accounts: {
      used: accountUsage,
      limit: limits.accountLimit,
      remaining:
        limits.accountLimit == null
          ? null
          : Math.max(0, limits.accountLimit - accountUsage),
    },
    dms: {
      used: dmUsage,
      limit: limits.dmMonthlyLimit,
      remaining:
        limits.dmMonthlyLimit == null
          ? null
          : Math.max(0, limits.dmMonthlyLimit - dmUsage),
      windowStart: (() => {
        const d = new Date();
        return new Date(
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
        ).toISOString();
      })(),
    },
  });
}
