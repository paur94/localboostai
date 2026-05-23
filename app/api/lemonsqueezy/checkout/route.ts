import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createLSCheckout } from "@/lib/lemonsqueezy";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { variantId } = await req.json() as { variantId: string };
    if (!variantId) return NextResponse.json({ error: "Variant ID is required" }, { status: 400 });

    const supabase = createServerClient();
    const { data: user } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", userId)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const checkout = await createLSCheckout({
      variantId,
      userId,
      email: user?.email ?? "",
      name: user?.name ?? undefined,
      successUrl: `${appUrl}/dashboard?checkout=success`,
    });

    return NextResponse.json({ url: checkout.attributes.url });
  } catch (error) {
    console.error("[lemonsqueezy/checkout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
