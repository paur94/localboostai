import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { FileText, Wallet, Zap } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <p className="text-muted-foreground">
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
        />
        <StatsCard
          title="Remaining Credits"
          value={remaining !== null ? remaining : "∞"}
          description={remaining !== null ? "credits left this month" : "Unlimited plan"}
          icon={Wallet}
        />
        <StatsCard
          title="Subscription Plan"
          value={planLabel}
          description="Current subscription"
          icon={Zap}
        />
      </div>

      {/* Usage bar */}
      {isFinite(limit) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <Badge variant={usagePercent >= 80 ? "destructive" : "secondary"}>
                {generationsThisMonth} / {limit}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={usagePercent} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {remaining} generations remaining this month
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lower grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={recentGenerations} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
