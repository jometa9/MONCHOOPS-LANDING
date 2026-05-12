import { authenticateApiKey } from "@/lib/auth/api-key";
import {
  countLeadsThisMonth,
  recordScrapeEvent,
} from "@/lib/db/usage-queries";
import {
  getSubscriptionTier,
  getUserEntitlements,
} from "@/lib/db/queries";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

interface ReportBody {
  jobId?: unknown;
  kind?: unknown;
  leadCount?: unknown;
  deviceId?: unknown;
  scrapedAt?: unknown;
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

  const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
  const kind = typeof body.kind === "string" ? body.kind.trim() : "";
  const rawLeadCount =
    typeof body.leadCount === "number" ? body.leadCount : Number(body.leadCount);
  if (!jobId || !kind || !Number.isFinite(rawLeadCount) || rawLeadCount < 0) {
    return NextResponse.json(
      { error: "jobId, kind and leadCount are required" },
      { status: 400 }
    );
  }
  const leadCount = Math.floor(rawLeadCount);

  const deviceId =
    typeof body.deviceId === "string" && body.deviceId.trim().length > 0
      ? body.deviceId.trim()
      : null;
  let scrapedAt: Date | undefined;
  if (typeof body.scrapedAt === "string" || typeof body.scrapedAt === "number") {
    const d = new Date(body.scrapedAt as string | number);
    if (!Number.isNaN(d.getTime())) scrapedAt = d;
  }

  const entitlements = await getUserEntitlements(user.id);
  const tier =
    user.role === "admin"
      ? "unlimited"
      : getSubscriptionTier(entitlements.monchoops);
  const limits = limitsForTier(tier, user.role === "admin");

  const currentUsed = await countLeadsThisMonth(user.id);

  let toRecord = leadCount;
  let dropped = 0;
  if (limits.leadsMonthlyLimit != null) {
    const remaining = Math.max(0, limits.leadsMonthlyLimit - currentUsed);
    if (remaining === 0) {
      return NextResponse.json(
        {
          error: "lead_limit_reached",
          message: `Your ${tier} plan allows ${limits.leadsMonthlyLimit} scraped leads per month. Upgrade for more.`,
          plan: tier,
          limit: limits.leadsMonthlyLimit,
          used: currentUsed,
          remaining: 0,
          recorded: 0,
          dropped: leadCount,
        },
        { status: 403 }
      );
    }
    if (leadCount > remaining) {
      toRecord = remaining;
      dropped = leadCount - remaining;
    }
  }

  const recorded = await recordScrapeEvent(user.id, {
    jobId,
    kind,
    leadCount: toRecord,
    deviceId,
    scrapedAt,
  });
  const used = currentUsed + recorded;

  return NextResponse.json({
    plan: tier,
    limit: limits.leadsMonthlyLimit,
    used,
    remaining:
      limits.leadsMonthlyLimit == null
        ? null
        : Math.max(0, limits.leadsMonthlyLimit - used),
    recorded,
    dropped,
  });
}
