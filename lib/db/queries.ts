import { and, eq, isNull } from "drizzle-orm";
import { cache } from "react";
import { auth } from "../auth/config";
import { db } from "./drizzle";
import {
  appSettings,
  ProductKey,
  user,
  userProductSubscription,
  UserProductSubscription,
} from "./schema";

export async function getUser() {
  try {
    const session = await auth();

    if (session?.user?.id) {
      const userResult = await db
        .select()
        .from(user)
        .where(and(eq(user.id, session.user.id), isNull(user.deletedAt)))
        .limit(1);

      if (userResult.length > 0) {
        return userResult[0];
      }
    }
  } catch (error) {
    console.error("Error getting current user from NextAuth session:", error);
  }

  return null;
}

export async function getUserByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserProductSubscriptions(
  userId: string
): Promise<UserProductSubscription[]> {
  return db
    .select()
    .from(userProductSubscription)
    .where(eq(userProductSubscription.userId, userId));
}

export async function getUserProductSubscription(
  userId: string,
  productKey: ProductKey
): Promise<UserProductSubscription | null> {
  const result = await db
    .select()
    .from(userProductSubscription)
    .where(
      and(
        eq(userProductSubscription.userId, userId),
        eq(userProductSubscription.productKey, productKey)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getProductSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<UserProductSubscription | null> {
  const result = await db
    .select()
    .from(userProductSubscription)
    .where(
      eq(userProductSubscription.stripeSubscriptionId, stripeSubscriptionId)
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function upsertProductSubscription(
  userId: string,
  productKey: ProductKey,
  data: {
    tier?: string;
    accountLimit?: number | null;
    status?: string;
    billingPeriod?: "monthly" | "annual" | null;
    stripeSubscriptionId?: string | null;
    stripeProductId?: string | null;
    planName?: string | null;
    expiresAt?: Date | null;
    metaPurchaseEventId?: string | null;
  }
): Promise<UserProductSubscription> {
  const existing = await getUserProductSubscription(userId, productKey);

  if (existing) {
    const result = await db
      .update(userProductSubscription)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userProductSubscription.id, existing.id))
      .returning();
    return result[0];
  } else {
    const result = await db
      .insert(userProductSubscription)
      .values({
        userId,
        productKey,
        tier: data.tier || "free",
        accountLimit: data.accountLimit ?? null,
        status: data.status || "active",
        billingPeriod: data.billingPeriod ?? null,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeProductId: data.stripeProductId,
        planName: data.planName,
        expiresAt: data.expiresAt,
        metaPurchaseEventId: data.metaPurchaseEventId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }
}


export async function deleteProductSubscription(
  userId: string,
  productKey: ProductKey
): Promise<void> {
  await db
    .delete(userProductSubscription)
    .where(
      and(
        eq(userProductSubscription.userId, userId),
        eq(userProductSubscription.productKey, productKey)
      )
    );
}

export async function getUserEntitlements(userId: string) {
  const subscriptions = await getUserProductSubscriptions(userId);

  const entitlements: {
    monchoops: UserProductSubscription | null;
  } = {
    monchoops: null,
  };

  for (const sub of subscriptions) {
    if (sub.productKey === "monchoops") {
      entitlements.monchoops = sub;
    }
  }

  return entitlements;
}

export function isActiveSubscription(
  sub: UserProductSubscription | null
): boolean {
  if (!sub) return false;

  if (["active", "trialing", "admin_assigned", "canceling"].includes(sub.status)) {
    return true;
  }

  if (sub.status === "canceled" && sub.expiresAt) {
    const now = new Date();
    if (sub.expiresAt > now) {
      return true;
    }
  }

  return false;
}

export function getSubscriptionTier(
  sub: UserProductSubscription | null
): string {
  if (!sub) return "free";

  if (isActiveSubscription(sub)) {
    return sub.tier || "free";
  }

  if (sub.status === "canceled" && sub.expiresAt) {
    const now = new Date();
    if (sub.expiresAt > now) {
      return sub.tier || "free";
    }
  }

  return "free";
}

export async function getUserByApiKey(apiKey: string) {
  const result = await db
    .select()
    .from(user)
    .where(and(eq(user.apiKey, apiKey), isNull(user.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateUserById(
  userId: string,
  userData: Partial<{
    stripeCustomerId: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    apiKey: string | null;
    metaPurchaseEventId: string | null;
  }>
) {
  try {
    const processedData = Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    );

    const dataToUpdate = {
      ...processedData,
      updatedAt: new Date(),
    };

    const result = await db
      .update(user)
      .set(dataToUpdate)
      .where(eq(user.id, userId))
      .returning();

    if (result.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return result[0];
  } catch (error) {
    throw error;
  }
}

const getUserByIdCached = cache(async (userId: string) => {
  const result = await db
    .select()
    .from(user)
    .where(and(eq(user.id, userId), isNull(user.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
});

export async function getUserById(userId: string) {
  return getUserByIdCached(userId);
}

export const getCurrentUserFromSession = cache(async () => {
  try {
    const currentUser = await getUser();
    if (currentUser) {
      return currentUser;
    }

    try {
      const session = await auth();
      if (!session?.user?.id) {
        return null;
      }
      return getUserByIdCached(session.user.id);
    } catch (error) {
      console.error("Error getting session from auth():", error);
      return null;
    }
    } catch (error) {
      console.error("Error in getCurrentUserFromSession:", error);
    return null;
  }
});

export async function getUserDataForDashboard(userId: string) {
  const { limitsForTier } = await import("@/lib/subscriptions/plan-limits");
  const { countActiveInstagramAccounts, countDmsThisMonth } = await import(
    "./usage-queries"
  );

  const [userData, entitlements, settings, accountUsage, dmUsage] =
    await Promise.all([
      getUserById(userId),
      getUserEntitlements(userId),
      getAppSettings(),
      countActiveInstagramAccounts(userId),
      countDmsThisMonth(userId),
    ]);

  if (!userData) return null;

  const sub = entitlements.monchoops;
  const isExpired =
    sub &&
    ["canceled", "expired"].includes(sub.status) &&
    (!sub.expiresAt || sub.expiresAt <= new Date());
  const monchoopsTier =
    userData.role === "admin" ? "unlimited" : getSubscriptionTier(sub);
  const planLimits = limitsForTier(monchoopsTier, userData.role === "admin");

  return {
    userId: userData.id,
    email: userData.email,
    name: userData.name || userData.email.split("@")[0],
    isAdmin: userData.role === "admin",
    entitlements: {
      monchoops: isExpired
        ? null
        : {
            active: userData.role === "admin" || isActiveSubscription(sub),
            tier: monchoopsTier,
            originalTier: sub?.tier || "free",
            status: sub?.status || "none",
            expiresAt: sub?.expiresAt?.toISOString() || null,
            limits: planLimits,
            usage: {
              accounts: accountUsage,
              dmsThisMonth: dmUsage,
            },
            billingPeriod: ((): "monthly" | "annual" | null => {
              const p = sub?.billingPeriod;
              return p === "monthly" || p === "annual" ? p : null;
            })(),
          },
    },
    downloads: {
      monchoops: {
        windows: {
          version: settings.monchoopsVersion,
          downloadUrl: settings.monchoopsWindowsDownloadUrl || null,
        },
        mac: {
          version: settings.monchoopsVersion,
          downloadUrl: settings.monchoopsMacDownloadUrl || null,
        },
      },
    },
  };
}

export async function getAppSettings() {
  const settings = await db
    .select()
    .from(appSettings)
    .orderBy(appSettings.id)
    .limit(1);

  if (settings.length === 0) {
    const defaultSettings = await db
      .insert(appSettings)
      .values({
        monchoopsVersion: "1.0.0",
        monchoopsWindowsDownloadUrl: "",
        monchoopsMacDownloadUrl: "",
        monchoopsExtensionUrl: "",
        updatedAt: new Date(),
      })
      .returning();

    return defaultSettings[0];
  }

  return settings[0];
}

export async function getDownloadInfo(
  productKey: ProductKey,
  os: "windows" | "mac"
): Promise<{ version: string; downloadUrl: string | null }> {
  const settings = await getAppSettings();
  if (os === "mac") {
    return {
      version: settings.monchoopsVersion,
      downloadUrl: settings.monchoopsMacDownloadUrl,
    };
  }
  return {
    version: settings.monchoopsVersion,
    downloadUrl: settings.monchoopsWindowsDownloadUrl,
  };
}

export async function updateAppSettings(
  userId: string,
  data: Partial<{
    monchoopsVersion: string;
    monchoopsWindowsDownloadUrl: string;
    monchoopsMacDownloadUrl: string;
    monchoopsExtensionUrl: string;
    resendApiKey: string | null;
    resendTestEmail: string | null;
    emailFrom: string | null;
    resendInboundWebhookSecret: string | null;
    discordWebhookUrl: string | null;
    discordDailyReportWebhookUrl: string | null;
  }>
) {
  const settings = await db
    .select()
    .from(appSettings)
    .orderBy(appSettings.id)
    .limit(1);

  try {
    if (settings.length === 0) {
      const result = await db
        .insert(appSettings)
        .values({
          monchoopsVersion: data.monchoopsVersion || "1.0.0",
          monchoopsWindowsDownloadUrl: data.monchoopsWindowsDownloadUrl || "",
          monchoopsMacDownloadUrl: data.monchoopsMacDownloadUrl || "",
          monchoopsExtensionUrl: data.monchoopsExtensionUrl || "",
          resendApiKey: data.resendApiKey ?? null,
          resendTestEmail: data.resendTestEmail ?? null,
          emailFrom: data.emailFrom ?? null,
          resendInboundWebhookSecret: data.resendInboundWebhookSecret ?? null,
          discordDailyReportWebhookUrl: data.discordDailyReportWebhookUrl ?? null,
          updatedAt: new Date(),
          updatedBy: userId,
        })
        .returning();

      return result[0];
    } else {
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
        updatedBy: userId,
      };

      if (data.monchoopsVersion !== undefined) {
        updateData.monchoopsVersion = data.monchoopsVersion;
      }
      if (data.monchoopsWindowsDownloadUrl !== undefined) {
        updateData.monchoopsWindowsDownloadUrl = data.monchoopsWindowsDownloadUrl;
      }
      if (data.monchoopsMacDownloadUrl !== undefined) {
        updateData.monchoopsMacDownloadUrl = data.monchoopsMacDownloadUrl;
      }
      if (data.monchoopsExtensionUrl !== undefined) {
        updateData.monchoopsExtensionUrl = data.monchoopsExtensionUrl;
      }
      if (data.resendApiKey !== undefined) {
        updateData.resendApiKey = data.resendApiKey ?? null;
      }
      if (data.resendTestEmail !== undefined) {
        updateData.resendTestEmail = data.resendTestEmail ?? null;
      }
      if (data.emailFrom !== undefined) {
        updateData.emailFrom = data.emailFrom ?? null;
      }
      if (data.resendInboundWebhookSecret !== undefined) {
        updateData.resendInboundWebhookSecret = data.resendInboundWebhookSecret ?? null;
      }
      if (data.discordWebhookUrl !== undefined) {
        updateData.discordWebhookUrl = data.discordWebhookUrl ?? null;
      }
      if (data.discordDailyReportWebhookUrl !== undefined) {
        updateData.discordDailyReportWebhookUrl =
          data.discordDailyReportWebhookUrl ?? null;
      }

      const result = await db
        .update(appSettings)
        .set(updateData)
        .where(eq(appSettings.id, settings[0].id))
        .returning();

      if (result.length > 0) {
        return result[0];
      } else {
        const currentSettings = await db
          .select()
          .from(appSettings)
          .where(eq(appSettings.id, settings[0].id))
          .limit(1);

        return currentSettings[0];
      }
    }
  } catch (error) {
    throw error;
  }
}

