import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getLSCustomerPortalUrl } from "@/lib/lemonsqueezy";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createServerClient();
    const { data: user } = await supabase
      .from("users")
      .select("lemon_squeezy_customer_id")
      .eq("id", userId)
      .single();

    if (!user?.lemon_squeezy_customer_id) {
      return NextResponse.json({ error: "No billing account" }, { status: 400 });
    }

    const portalUrl = await getLSCustomerPortalUrl(user.lemon_squeezy_customer_id);
    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("[lemonsqueezy/portal]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
