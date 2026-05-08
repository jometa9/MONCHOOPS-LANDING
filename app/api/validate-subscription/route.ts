import { db } from "@/lib/db/drizzle";
import {
  getAppSettings,
  getUserByApiKey,
  getUserEntitlements,
  isActiveSubscription,
  getSubscriptionTier,
} from "@/lib/db/queries";
import {
  countActiveInstagramAccounts,
  countDmsThisMonth,
} from "@/lib/db/usage-queries";
import { userProductSubscription } from "@/lib/db/schema";
import { paymentsEnabled } from "@/lib/payments/feature-flag";
import { handleSubscriptionChange, stripe } from "@/lib/payments/stripe";
import { limitsForTier } from "@/lib/subscriptions/plan-limits";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get("apiKey");

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required as a URL parameter (apiKey=your_key)" },
      { status: 401 }
    );
  }

  try {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid License Key" },
        { status: 401 }
      );
    }

    if (!paymentsEnabled) {
      const appSettings = await getAppSettings();
      const limits = limitsForTier("unlimited", true);
      const [accountUsage, dmUsage] = await Promise.all([
        countActiveInstagramAccounts(user.id),
        countDmsThisMonth(user.id),
      ]);
      return NextResponse.json({
        email: user.email,
        name: user.name || user.email.split("@")[0],
        plan: "unlimited",
        version: appSettings.monchoopsVersion,
        windowsDownloadUrl: appSettings.monchoopsWindowsDownloadUrl || null,
        macDownloadUrl: appSettings.monchoopsMacDownloadUrl || null,
        accountLimit: limits.accountLimit,
        dmMonthlyLimit: limits.dmMonthlyLimit,
        accountUsage,
        dmUsage,
      });
    }

    const now = new Date();

    const entitlements = await getUserEntitlements(user.id);

    for (const key of ["monchoops"] as const) {
      const sub = entitlements[key];
      if (sub?.stripeSubscriptionId) {
        try {
          const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId, {
            expand: ["items.data.price.product"],
          });
          
          const price = stripeSub.items.data[0]?.price;
          let billingPeriod: "monthly" | "annual" | null = null;
          if (price?.recurring?.interval === "year") {
            billingPeriod = "annual";
          } else if (price?.recurring?.interval === "month") {
            billingPeriod = "monthly";
          }
          
          let stripeTier: "unlimited" | "pro" | "free" = "free";
          const product = price?.product;
          if (product && typeof product === "object" && "name" in product) {
            const productName = (product.name as string).toLowerCase();
            if (productName.includes("unlimited")) {
              stripeTier = "unlimited";
            } else if (productName.includes("pro")) {
              stripeTier = "pro";
            }
          }
          
          const dbBillingPeriod = sub.billingPeriod;
          const dbTier = sub.tier;
          const metadataBillingPeriod = stripeSub.metadata?.billingPeriod;
          
          const stripeExpiresAt = stripeSub.current_period_end 
            ? new Date(stripeSub.current_period_end * 1000) 
            : null;
          const dbExpiresAt = sub.expiresAt;
          const expiresAtNeedsSync = stripeExpiresAt && (
            !dbExpiresAt || 
            Math.abs(stripeExpiresAt.getTime() - dbExpiresAt.getTime()) > 60000
          );
          
          const billingPeriodNeedsSync = billingPeriod && (dbBillingPeriod !== billingPeriod || metadataBillingPeriod !== billingPeriod);
          const tierNeedsSync = stripeTier !== "free" && dbTier !== stripeTier;
          
          if (billingPeriodNeedsSync || tierNeedsSync || expiresAtNeedsSync) {
            const updateData: Record<string, unknown> = { updatedAt: now };
            if (billingPeriodNeedsSync && billingPeriod) {
              updateData.billingPeriod = billingPeriod;
            }
            if (tierNeedsSync) {
              updateData.tier = stripeTier;
            }
            if (expiresAtNeedsSync && stripeExpiresAt) {
              updateData.expiresAt = stripeExpiresAt;
            }
            
            await db
              .update(userProductSubscription)
              .set(updateData)
              .where(eq(userProductSubscription.id, sub.id));

            if (billingPeriodNeedsSync && billingPeriod) {
              try {
                await stripe.subscriptions.update(sub.stripeSubscriptionId, {
                  metadata: {
                    ...stripeSub.metadata,
                    billingPeriod,
                  },
                });
              } catch {}
            }

            if (entitlements[key]) {
              if (billingPeriodNeedsSync && billingPeriod) {
                entitlements[key]!.billingPeriod = billingPeriod;
              }
              if (tierNeedsSync) {
                entitlements[key]!.tier = stripeTier;
              }
              if (expiresAtNeedsSync && stripeExpiresAt) {
                entitlements[key]!.expiresAt = stripeExpiresAt;
              }
            }
          }

          const isScheduledForCancellation = stripeSub.cancel_at_period_end;
          const needsStatusUpdate = stripeSub.status !== sub.status;
          const needsCancelingUpdate = isScheduledForCancellation && 
                                       sub.status !== "canceling" && 
                                       sub.status !== "canceled";
          
          if (needsStatusUpdate || needsCancelingUpdate) {
            const isPlanChange = stripeSub.metadata?.isPlanChange === "true";
            const isProductSwitch = stripeSub.metadata?.isProductSwitch === "true";
            
            await handleSubscriptionChange(
              stripeSub,
              "customer.subscription.updated",
              { skipEmail: isPlanChange || isProductSwitch }
            );
            
            if (entitlements[key]) {
              entitlements[key]!.status = isScheduledForCancellation ? "canceling" : stripeSub.status;
            }
          }

          if (isScheduledForCancellation && sub.status !== "canceling" && sub.status !== "canceled") {
            await db
              .update(userProductSubscription)
              .set({ status: "canceling", updatedAt: now })
              .where(eq(userProductSubscription.id, sub.id));
            if (entitlements[key]) {
              entitlements[key]!.status = "canceling";
            }
          }
        } catch (stripeError: unknown) {
          const errorMessage =
            stripeError instanceof Error
              ? stripeError.message
              : String(stripeError);
          
          if (
            errorMessage.includes("No such subscription") ||
            errorMessage.includes("resource_missing")
          ) {
            if (sub.expiresAt && sub.expiresAt < now && isActiveSubscription(sub)) {
              await db
                .update(userProductSubscription)
                .set({ status: "past_due", updatedAt: now })
                .where(eq(userProductSubscription.id, sub.id));
              if (entitlements[key]) {
                entitlements[key]!.status = "past_due";
              }
            }
          } else {
            console.error(
              `[Validate Subscription] Error retrieving subscription ${sub.stripeSubscriptionId}:`,
              errorMessage
            );
          }
        }
      } else if (sub && !sub.stripeSubscriptionId && isActiveSubscription(sub) && sub.expiresAt) {
        if (sub.expiresAt < now) {
          await db
            .update(userProductSubscription)
            .set({ status: "expired", updatedAt: now })
            .where(eq(userProductSubscription.id, sub.id));
          
          if (entitlements[key]) {
            entitlements[key]!.status = "expired";
          }
        }
      }
    }


    const appSettings = await getAppSettings();

    const monchoopsTier =
      user.role === "admin"
        ? "unlimited"
        : getSubscriptionTier(entitlements.monchoops);
    const monchoopsLimits = limitsForTier(monchoopsTier, user.role === "admin");

    const [accountUsage, dmUsage] = await Promise.all([
      countActiveInstagramAccounts(user.id),
      countDmsThisMonth(user.id),
    ]);

    const response = {
      email: user.email,
      name: user.name || user.email.split("@")[0],
      plan: monchoopsTier,
      version: appSettings.monchoopsVersion,
      windowsDownloadUrl: appSettings.monchoopsWindowsDownloadUrl || null,
      macDownloadUrl: appSettings.monchoopsMacDownloadUrl || null,
      accountLimit: monchoopsLimits.accountLimit,
      dmMonthlyLimit: monchoopsLimits.dmMonthlyLimit,
      accountUsage,
      dmUsage,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in validate-subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
