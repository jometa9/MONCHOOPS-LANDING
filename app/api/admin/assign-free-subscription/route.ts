"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db/drizzle";
import { getUserById, getUserProductSubscription, upsertProductSubscription, deleteProductSubscription } from "@/lib/db/queries";
import { user, ProductKey } from "@/lib/db/schema";
import { stripe } from "@/lib/payments/stripe";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { email, productKey, plan, duration, accountLimit, force } = data;

    if (!email || !productKey || !duration) {
      return NextResponse.json(
        { error: "Missing required fields (email, productKey, duration)" },
        { status: 400 }
      );
    }

    if (productKey !== "monchoops") {
      return NextResponse.json(
        { error: "Invalid productKey. Must be 'monchoops'" },
        { status: 400 }
      );
    }

    if (!plan) {
      return NextResponse.json(
        { error: "Missing required field: plan (required for monchoops)" },
        { status: 400 }
      );
    }

    if (plan !== "none" && plan !== "pro" && plan !== "unlimited") {
      return NextResponse.json(
        { error: "Plan must be 'pro', 'unlimited' or 'none'" },
        { status: 400 }
      );
    }

    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const foundUser = userResult[0];

    const existingSubscription = await getUserProductSubscription(foundUser.id, productKey as ProductKey);

    if (existingSubscription?.stripeSubscriptionId && !force) {
      return NextResponse.json({
        warning: true,
        message: `User already has a Stripe subscription for ${productKey.toUpperCase()}. Set force=true to override.`,
        existingSubscription: {
          planName: existingSubscription.planName || existingSubscription.tier,
          status: existingSubscription.status,
          isPaid: true,
        },
      }, { status: 409 });
    }

    let stripeCanceled = false;
    if (existingSubscription?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId);
        stripeCanceled = true;
      } catch (stripeError: unknown) {
        const errorMessage =
          stripeError instanceof Error
            ? stripeError.message
            : String(stripeError);
        if (!errorMessage.includes("No such subscription")) {
        }
      }
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    if (plan === "none") {
      await deleteProductSubscription(foundUser.id, productKey as ProductKey);
    } else {
      await upsertProductSubscription(foundUser.id, productKey as ProductKey, {
        tier: plan,
        status: "admin_assigned",
        stripeSubscriptionId: null,
        stripeProductId: null,
        planName: `${plan.charAt(0).toUpperCase() + plan.slice(1)} (Admin Assigned)`,
        expiresAt: expiryDate,
      });
    }

    const successMessage = plan === "none"
      ? `Subscription for ${productKey.toUpperCase()} removed from ${email}.`
      : `${plan} subscription for ${productKey.toUpperCase()} assigned to ${email} for ${duration} month(s).${stripeCanceled ? " Previous Stripe subscription was canceled." : ""}`;

    return NextResponse.json({
      success: true,
      message: successMessage,
      stripeCanceled,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to assign free subscription",
      },
      { status: 500 }
    );
  }
}
