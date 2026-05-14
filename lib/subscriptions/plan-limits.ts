import { db } from "@/lib/db/drizzle";
import { planLimits, type SubscriptionTier } from "@/lib/db/schema";

export interface PlanLimits {
  accountLimit: number | null;
  dmMonthlyLimit: number | null;
  leadsMonthlyLimit: number | null;
}

const FALLBACK_LIMITS: Record<"free" | "pro" | "unlimited", PlanLimits> = {
  free: { accountLimit: 1, dmMonthlyLimit: 100, leadsMonthlyLimit: 100 },
  pro: { accountLimit: 5, dmMonthlyLimit: 5000, leadsMonthlyLimit: 5000 },
  unlimited: { accountLimit: null, dmMonthlyLimit: null, leadsMonthlyLimit: null },
};

const CACHE_TTL_MS = 60_000;

let cache: { value: Record<string, PlanLimits>; expiresAt: number } | null = null;

function normaliseTier(
  tier: SubscriptionTier | string | null | undefined
): "free" | "pro" | "unlimited" {
  if (tier === "unlimited") return "unlimited";
  if (tier === "pro") return "pro";
  return "free";
}

async function loadAllLimits(): Promise<Record<string, PlanLimits>> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.value;

  try {
    const rows = await db.select().from(planLimits);
    const map: Record<string, PlanLimits> = { ...FALLBACK_LIMITS };
    for (const row of rows) {
      map[row.tier] = {
        accountLimit: row.accountLimit,
        dmMonthlyLimit: row.dmMonthlyLimit,
        leadsMonthlyLimit: row.leadsMonthlyLimit,
      };
    }
    cache = { value: map, expiresAt: now + CACHE_TTL_MS };
    return map;
  } catch (err) {
    // If DB is unreachable or table missing, fall back to safe defaults so
    // enforcement keeps working rather than letting everything through.
    console.error("[plan-limits] failed to load from DB, using fallback", err);
    return FALLBACK_LIMITS;
  }
}

export function invalidatePlanLimitsCache(): void {
  cache = null;
}

export async function limitsForTier(
  tier: SubscriptionTier | string | null | undefined,
  isAdmin = false
): Promise<PlanLimits> {
  if (isAdmin) {
    const all = await loadAllLimits();
    return all.unlimited ?? FALLBACK_LIMITS.unlimited;
  }
  const all = await loadAllLimits();
  return all[normaliseTier(tier)] ?? FALLBACK_LIMITS[normaliseTier(tier)];
}

export async function getAllPlanLimits(): Promise<
  Record<"free" | "pro" | "unlimited", PlanLimits>
> {
  const all = await loadAllLimits();
  return {
    free: all.free ?? FALLBACK_LIMITS.free,
    pro: all.pro ?? FALLBACK_LIMITS.pro,
    unlimited: all.unlimited ?? FALLBACK_LIMITS.unlimited,
  };
}

export function startOfCurrentMonthUTC(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}
