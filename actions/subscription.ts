"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getLSCustomerPortalUrl } from "@/lib/lemonsqueezy";

export async function getSubscription() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  return data;
}

export async function openBillingPortal(returnUrl: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const supabase = createServerClient();
  const { data: user } = await supabase
    .from("users")
    .select("lemon_squeezy_customer_id")
    .eq("id", userId)
    .single();

  if (!user?.lemon_squeezy_customer_id) return { error: "No billing account found" };

  const url = await getLSCustomerPortalUrl(user.lemon_squeezy_customer_id);
  return { url };
}
