import type { SubscriptionTier } from "@/lib/db/schema";

export interface PlanLimits {
  accountLimit: number | null;
  dmMonthlyLimit: number | null;
  leadsMonthlyLimit: number | null;
}

export const PLAN_LIMITS: Record<"free" | "pro" | "unlimited", PlanLimits> = {
  free: { accountLimit: 1, dmMonthlyLimit: 100, leadsMonthlyLimit: 100 },
  pro: { accountLimit: 5, dmMonthlyLimit: 5000, leadsMonthlyLimit: 5000 },
  unlimited: { accountLimit: null, dmMonthlyLimit: null, leadsMonthlyLimit: null },
};

export function limitsForTier(
  tier: SubscriptionTier | string | null | undefined,
  isAdmin = false
): PlanLimits {
  if (isAdmin) return PLAN_LIMITS.unlimited;
  if (tier === "unlimited") return PLAN_LIMITS.unlimited;
  if (tier === "pro") return PLAN_LIMITS.pro;
  return PLAN_LIMITS.free;
}

export function startOfCurrentMonthUTC(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}
