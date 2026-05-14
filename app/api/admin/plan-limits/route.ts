import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { planLimits } from "@/lib/db/schema";
import {
  getAllPlanLimits,
  invalidatePlanLimitsCache,
} from "@/lib/subscriptions/plan-limits";
import { NextRequest, NextResponse } from "next/server";

const TIERS = ["free", "pro", "unlimited"] as const;
type Tier = (typeof TIERS)[number];

interface TierPayload {
  accountLimit: number | null;
  dmMonthlyLimit: number | null;
  leadsMonthlyLimit: number | null;
}

function isTier(value: unknown): value is Tier {
  return typeof value === "string" && (TIERS as readonly string[]).includes(value);
}

function coerceLimit(raw: unknown): number | null | undefined {
  if (raw === null) return null;
  if (raw === undefined) return undefined;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) {
    return Math.floor(raw);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "unlimited" || trimmed === "∞") {
      return null;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed) && parsed >= 0) return Math.floor(parsed);
  }
  return undefined;
}

export async function GET() {
  const user = await getUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const all = await getAllPlanLimits();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const updates: { tier: Tier; values: TierPayload }[] = [];

  for (const tier of TIERS) {
    const entry = payload[tier];
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const accountLimit = coerceLimit(row.accountLimit);
    const dmMonthlyLimit = coerceLimit(row.dmMonthlyLimit);
    const leadsMonthlyLimit = coerceLimit(row.leadsMonthlyLimit);
    if (
      accountLimit === undefined ||
      dmMonthlyLimit === undefined ||
      leadsMonthlyLimit === undefined
    ) {
      return NextResponse.json(
        { error: `Invalid limit values for tier "${tier}"` },
        { status: 400 }
      );
    }
    updates.push({
      tier,
      values: { accountLimit, dmMonthlyLimit, leadsMonthlyLimit },
    });
  }

  if (updates.length === 0) {
    return NextResponse.json(
      { error: "No tier updates provided" },
      { status: 400 }
    );
  }

  const now = new Date();
  for (const { tier, values } of updates) {
    await db
      .insert(planLimits)
      .values({
        tier,
        ...values,
        updatedAt: now,
        updatedBy: user.id,
      })
      .onConflictDoUpdate({
        target: planLimits.tier,
        set: { ...values, updatedAt: now, updatedBy: user.id },
      });
  }

  invalidatePlanLimitsCache();
  const all = await getAllPlanLimits();
  return NextResponse.json(all);
}
