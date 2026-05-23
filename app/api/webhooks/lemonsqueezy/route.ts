import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/server";
import type { SubscriptionTier } from "@/types/database";

function mapStatus(status: string): "active" | "canceled" | "past_due" | "trialing" | "incomplete" {
  switch (status) {
    case "active": return "active";
    case "on_trial": return "trialing";
    case "past_due":
    case "unpaid":
    case "paused": return "past_due";
    case "cancelled":
    case "expired": return "canceled";
    default: return "incomplete";
  }
}

function mapTier(variantId: string): SubscriptionTier {
  if (variantId === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) return "pro";
  if (variantId === process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID) return "business";
  return "free";
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  const digest = crypto
    .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(signature, "utf8"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;
  const supabase = createServerClient();

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      const attrs = payload.data.attributes;
      const userId: string = payload.meta?.custom_data?.userId;
      if (!userId) break;

      const variantId = String(attrs.variant_id);
      const subscriptionId = String(payload.data.id);
      const customerId = String(attrs.customer_id);
      const status = mapStatus(attrs.status);
      const tier = status === "active" || status === "trialing" ? mapTier(variantId) : "free";

      await Promise.all([
        supabase.from("users").update({
          subscription_tier: tier,
          lemon_squeezy_customer_id: customerId,
          lemon_squeezy_subscription_id: subscriptionId,
        }).eq("id", userId),
        supabase.from("subscriptions").upsert({
          id: subscriptionId,
          user_id: userId,
          status,
          price_id: variantId,
          current_period_start: attrs.created_at ?? new Date().toISOString(),
          current_period_end: attrs.renews_at ?? new Date().toISOString(),
        }),
      ]);
      break;
    }

    case "subscription_cancelled": {
      const attrs = payload.data.attributes;
      const userId: string = payload.meta?.custom_data?.userId;
      const subscriptionId = String(payload.data.id);
      if (!userId) break;

      await Promise.all([
        supabase.from("users").update({
          subscription_tier: "free",
          lemon_squeezy_subscription_id: null,
        }).eq("id", userId),
        supabase.from("subscriptions")
          .update({ status: "canceled" })
          .eq("id", subscriptionId),
      ]);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
