import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { FileText, Wallet, Zap } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Badge } from "@/components/ui/badge";
import { GENERATION_LIMITS } from "@/lib/constants";
import type { ContentGeneration, User } from "@/types/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  let dbUser: User | null = null;
  let recentGenerations: ContentGeneration[] = [];
  let generationsThisMonth = 0;

  if (userId) {
    const supabase = createServerClient();

    const [userRes, generationsRes] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase
        .from("content_generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    dbUser = userRes.data;

    // Auto-sync: if the user doesn't exist in Supabase yet (webhook not fired), create them now
    if (!dbUser && clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      const name = clerkUser.fullName ?? clerkUser.firstName ?? null;
      const { data: newUser } = await supabase
        .from("users")
        .upsert(
          { id: userId, email, name, image_url: clerkUser.imageUrl ?? null, subscription_tier: "free" },
          { onConflict: "id" }
        )
        .select()
        .single();
      dbUser = newUser;
    }
    recentGenerations = generationsRes.data ?? [];

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
  const displayName =
    clerkUser?.firstName ??
    clerkUser?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
    "there";
  const planLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your content generation activity.
        </p>
      </div>

      {/* Stats — 3 cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Posts Generated This Month"
          value={generationsThisMonth}
          description={`of ${isFinite(limit) ? limit : "∞"} included`}
          icon={FileText}
          trend={generationsThisMonth > 0 ? { value: 12, positive: true } : undefined}
          accent="from-blue-500/15 to-indigo-500/5"
        />
        <StatsCard
          title="Remaining Credits"
          value={remaining !== null ? remaining : "∞"}
          description={remaining !== null ? "credits left this month" : "Unlimited plan"}
          icon={Wallet}
          accent="from-purple-500/15 to-pink-500/5"
        />
        <StatsCard
          title="Subscription Plan"
          value={planLabel}
          description="Current subscription"
          icon={Zap}
          accent="from-amber-500/15 to-orange-500/5"
        />
      </div>

      {/* Usage bar */}
      {isFinite(limit) && (
        <div className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Monthly Usage</p>
            <Badge variant={usagePercent >= 80 ? "destructive" : "secondary"} className="rounded-full text-xs">
              {generationsThisMonth} / {limit}
            </Badge>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${usagePercent}%`,
                background: usagePercent >= 80
                  ? "oklch(0.577 0.245 27.325)"
                  : "linear-gradient(90deg, oklch(0.529 0.194 256.8), oklch(0.65 0.18 300))",
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {remaining} generations remaining this month
          </p>
        </div>
      )}

      {/* Lower grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={recentGenerations} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
