"use server";

import {
  getUser,
  getUserProductSubscription,
  upsertProductSubscription,
} from "@/lib/db/queries";
import { ProductKey } from "@/lib/db/schema";
import {
  createCustomerPortalSession,
  stripe,
} from "@/lib/payments/stripe";

export async function customerPortalAction(
  productKey: ProductKey = "monchoops"
): Promise<{
  error?: string;
  redirect?: string;
}> {
  try {
    const user = await getUser();

    if (!user) {
      return { error: "no-session" };
    }

    if (!user.stripeCustomerId) {
      return { error: "no-customer-id" };
    }

    const subscription = await getUserProductSubscription(user.id, productKey);

    if (
      !subscription ||
      !subscription.stripeSubscriptionId ||
      (subscription.status !== "active" && subscription.status !== "trialing" && subscription.status !== "canceling")
    ) {
      return { error: "no-active-subscription" };
    }

    const session = await createCustomerPortalSession(
      user,
      subscription.stripeSubscriptionId,
      subscription.stripeProductId,
      productKey,
      subscription.tier as "pro" | "unlimited"
    );

    if ("error" in session) {
      return { error: session.error };
    }

    if (!session.url) {
      return { error: "portal-access" };
    }

    return { redirect: session.url };
  } catch (error) {
    console.error("Error in customerPortalAction:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error) {
      if (
        error.message.includes("API key") ||
        error.message.includes("stripe")
      ) {
        return { error: "stripe-api-key" };
      } else if (error.message.includes("product")) {
        return { error: "no-product-id" };
      } else if (error.message.includes("customer")) {
        return { error: "invalid-customer" };
      } else if (error.message.includes("configuration")) {
        return { error: "portal-config" };
      }
    }

    return { error: "portal-access" };
  }
}

export async function changePlanAction(
  productKey: ProductKey,
  newPriceId: string
): Promise<{
  success?: boolean;
  error?: string;
  message?: string;
  isUpgrade?: boolean;
  effectiveDate?: string;
}> {
  try {
    if (!newPriceId || !newPriceId.startsWith("price_")) {
      return { error: "invalid-price-format" };
    }

    const user = await getUser();

    if (!user) {
      return { error: "no-auth" };
    }

    const productSubscription = await getUserProductSubscription(
      user.id,
      productKey
    );

    if (!productSubscription?.stripeSubscriptionId || !user.stripeCustomerId) {
      return { error: "no-active-subscription" };
    }

    if (
      productSubscription.status !== "active" &&
      productSubscription.status !== "trialing" &&
      productSubscription.status !== "canceling"
    ) {
      return { error: "subscription-not-active" };
    }

    const subscription = await stripe.subscriptions.retrieve(
      productSubscription.stripeSubscriptionId
    );

    const currentItem = subscription.items.data[0];
    if (!currentItem) {
      return { error: "no-subscription-item" };
    }

    const currentPriceId = currentItem.price.id;

    if (currentPriceId === newPriceId) {
      return { error: "same-plan" };
    }

    const updatedSubscription = await stripe.subscriptions.update(
      productSubscription.stripeSubscriptionId,
      {
        items: [
          {
            id: currentItem.id,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations",
        metadata: {
          ...subscription.metadata,
          isPlanChange: "true",
        },
      }
    );

    const expandedSubscription = await stripe.subscriptions.retrieve(
      updatedSubscription.id,
      {
        expand: ["items.data.price.product"],
      }
    );

    const { handleSubscriptionChange } = await import("@/lib/payments/stripe");
    await handleSubscriptionChange(expandedSubscription, "customer.subscription.updated");

    return {
      success: true,
      isUpgrade: true,
      message: "Plan changed successfully",
    };
  } catch (error) {
    console.error("Error changing plan:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "change-plan-error" };
  }
}
