import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countDmsThisMonth,
  recordDmEvents,
  type RecordDmInput,
} from "@/lib/db/usage-queries";
import {
  getSubscriptionTier,
  getUserEntitlements,
} from "@/lib/db/queries";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

interface DmEventBody {
  fromUsername?: unknown;
  targetUsername?: unknown;
  deviceId?: unknown;
  sentAt?: unknown;
}

interface ReportBody {
  events?: unknown;
  fromUsername?: unknown;
  targetUsername?: unknown;
  deviceId?: unknown;
  sentAt?: unknown;
}

function coerceEvent(raw: DmEventBody): RecordDmInput | null {
  const fromUsername =
    typeof raw.fromUsername === "string" ? raw.fromUsername.trim() : "";
  const targetUsername =
    typeof raw.targetUsername === "string" ? raw.targetUsername.trim() : "";
  if (!fromUsername || !targetUsername) return null;
  const deviceId =
    typeof raw.deviceId === "string" && raw.deviceId.trim().length > 0
      ? raw.deviceId.trim()
      : null;
  let sentAt: Date | undefined;
  if (typeof raw.sentAt === "string" || typeof raw.sentAt === "number") {
    const d = new Date(raw.sentAt as string | number);
    if (!Number.isNaN(d.getTime())) sentAt = d;
  }
  return { fromUsername, targetUsername, deviceId, sentAt };
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: ReportBody;
  try {
    body = (await request.json()) as ReportBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const events: RecordDmInput[] = [];
  if (Array.isArray(body.events)) {
    for (const e of body.events) {
      const evt = coerceEvent(e as DmEventBody);
      if (evt) events.push(evt);
    }
  } else {
    const single = coerceEvent(body as DmEventBody);
    if (single) events.push(single);
  }

  if (events.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one DM event with fromUsername and targetUsername" },
      { status: 400 }
    );
  }

  const entitlements = await getUserEntitlements(user.id);
  const tier =
    user.role === "admin"
      ? "unlimited"
      : getSubscriptionTier(entitlements.monchoops);
  const limits = limitsForTier(tier, user.role === "admin");

  const currentUsed = await countDmsThisMonth(user.id);

  // Trim the batch to whatever the remaining quota allows. Anything dropped
  // is reported back so the client can stop sending more for the month.
  let toRecord = events;
  let dropped = 0;
  if (limits.dmMonthlyLimit != null) {
    const remaining = Math.max(0, limits.dmMonthlyLimit - currentUsed);
    if (remaining === 0) {
      return NextResponse.json(
        {
          error: "dm_limit_reached",
          message: `Your ${tier} plan allows ${limits.dmMonthlyLimit} DMs per month. Upgrade for more.`,
          plan: tier,
          limit: limits.dmMonthlyLimit,
          used: currentUsed,
          remaining: 0,
          recorded: 0,
          dropped: events.length,
        },
        { status: 403 }
      );
    }
    if (events.length > remaining) {
      toRecord = events.slice(0, remaining);
      dropped = events.length - remaining;
    }
  }

  const recorded = await recordDmEvents(user.id, toRecord);
  const used = currentUsed + recorded;

  return NextResponse.json({
    plan: tier,
    limit: limits.dmMonthlyLimit,
    used,
    remaining:
      limits.dmMonthlyLimit == null
        ? null
        : Math.max(0, limits.dmMonthlyLimit - used),
    recorded,
    dropped,
  });
}
