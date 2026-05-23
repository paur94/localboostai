import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Zap, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { GENERATION_LIMITS } from "@/lib/constants";
import type { User } from "@/types/database";

export const metadata: Metadata = { title: "Billing" };

const planFeatures: Record<string, string[]> = {
  free: ["10 generations / month", "2 platforms", "Basic content types", "Community support"],
  pro: ["200 generations / month", "All platforms", "All content types", "Priority support", "Analytics"],
  business: ["Unlimited generations", "All platforms", "All content types", "Dedicated support", "Analytics", "Custom tone"],
};

export default async function BillingPage() {
  const { userId } = await auth();

  let dbUser: User | null = null;
  let generationsThisMonth = 0;

  if (userId) {
    const supabase = createServerClient();

    const [userRes] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
    ]);

    dbUser = userRes.data;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("content_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    generationsThisMonth = count ?? 0;
  }

  const tier = dbUser?.subscription_tier ?? "free";
  const limit = GENERATION_LIMITS[tier];
  const remaining = isFinite(limit) ? Math.max(limit - generationsThisMonth, 0) : null;
  const usagePercent = isFinite(limit) ? Math.min((generationsThisMonth / limit) * 100, 100) : 0;
  const planLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const features = planFeatures[tier] ?? planFeatures.free;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1
          className="text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-instrument-serif), serif" }}
        >
          Billing &amp; <em className="italic text-white/60">Subscription</em>
        </h1>
        <p className="text-white/40 mt-1 text-sm">Manage your plan and usage.</p>
      </div>

      {/* Current plan card */}
      <div className="liquid-glass rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="liquid-glass rounded-2xl p-3">
              <Zap className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest">Current Plan</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-instrument-serif), serif" }}>
                {planLabel}
              </p>
            </div>
          </div>
          {tier !== "business" && (
            <Link
              href="/pricing"
              className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Upgrade
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm text-white/60">
              <CheckCircle2 className="h-4 w-4 text-white/30 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Usage card */}
      <div className="liquid-glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/60">Monthly Usage</p>
          <span className="text-xs text-white/40">
            {generationsThisMonth} / {isFinite(limit) ? limit : "∞"}
          </span>
        </div>

        {isFinite(limit) ? (
          <>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${usagePercent}%`,
                  background: usagePercent >= 80 ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.5)",
                }}
              />
            </div>
            <p className="text-xs text-white/30">
              {remaining} generations remaining this month
            </p>
          </>
        ) : (
          <p className="text-sm text-white/40">Unlimited generations on your plan.</p>
        )}
      </div>

      {/* Manage billing */}
      {tier !== "free" && (
        <div className="liquid-glass rounded-3xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Manage subscription</p>
            <p className="text-xs text-white/40 mt-0.5">
              Update payment method, cancel, or view invoices
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors shrink-0"
          >
            Manage
          </Link>
        </div>
      )}

      {tier === "free" && (
        <div className="liquid-glass rounded-3xl p-6 text-center space-y-3">
          <p
            className="text-lg font-medium text-white"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
          >
            Ready to grow?
          </p>
          <p className="text-sm text-white/40">
            Upgrade to Pro for 200 generations/month across all platforms.
          </p>
          <Link
            href="/pricing"
            className="inline-block liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
