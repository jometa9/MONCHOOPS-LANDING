import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countActiveInstagramAccounts,
  registerInstagramAccount,
} from "@/lib/db/usage-queries";
import {
  getSubscriptionTier,
  getUserEntitlements,
} from "@/lib/db/queries";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

interface RegisterBody {
  username?: unknown;
  deviceId?: unknown;
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }
  const deviceId =
    typeof body.deviceId === "string" && body.deviceId.trim().length > 0
      ? body.deviceId.trim()
      : null;

  const entitlements = await getUserEntitlements(user.id);
  const tier =
    user.role === "admin"
      ? "unlimited"
      : getSubscriptionTier(entitlements.monchoops);
  const limits = await limitsForTier(tier, user.role === "admin");

  const currentCount = await countActiveInstagramAccounts(user.id);

  // The check below is "would this push us over the limit?" — registering an
  // already-active username is idempotent and does not consume a slot.
  if (limits.accountLimit != null) {
    // Peek to know whether this would create a new active row before writing,
    // so we can return a clean 403 instead of inserting then rolling back.
    const wouldAddNew = !(await alreadyActive(user.id, username));
    if (wouldAddNew && currentCount >= limits.accountLimit) {
      return NextResponse.json(
        {
          error: "account_limit_reached",
          message: `Your ${tier} plan allows ${limits.accountLimit} Instagram account${
            limits.accountLimit === 1 ? "" : "s"
          }. Upgrade to add more.`,
          plan: tier,
          limit: limits.accountLimit,
          used: currentCount,
        },
        { status: 403 }
      );
    }
  }

  const result = await registerInstagramAccount(user.id, username, deviceId);
  const used = await countActiveInstagramAccounts(user.id);

  return NextResponse.json({
    plan: tier,
    limit: limits.accountLimit,
    used,
    remaining:
      limits.accountLimit == null
        ? null
        : Math.max(0, limits.accountLimit - used),
    account: {
      id: result.account.id,
      username: result.account.username,
      deviceId: result.account.deviceId,
      addedAt: result.account.addedAt.toISOString(),
    },
    created: result.created,
    reactivated: result.reactivated,
  });
}

async function alreadyActive(userId: string, rawUsername: string): Promise<boolean> {
  const accounts = await import("@/lib/db/usage-queries").then((m) =>
    m.listActiveInstagramAccounts(userId)
  );
  const normalized = rawUsername.trim().replace(/^@+/, "").toLowerCase();
  return accounts.some((a) => a.username === normalized);
}
