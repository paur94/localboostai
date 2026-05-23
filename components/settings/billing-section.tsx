"use client";

import Link from "next/link";
import { CreditCard, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRICING_PLANS } from "@/lib/constants";
import { useCheckout } from "@/hooks/use-checkout";
import type { SubscriptionTier } from "@/types/database";

interface BillingSectionProps {
  tier: SubscriptionTier;
  lsCustomerId: string | null;
}

export function BillingSection({ tier, lsCustomerId }: BillingSectionProps) {
  const { handleCheckout, loading } = useCheckout();
  const currentPlan = PRICING_PLANS.find((p) => p.id === tier);

  const handleManageBilling = async () => {
    if (!lsCustomerId) return;
    const res = await fetch("/api/lemonsqueezy/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <Badge variant={tier === "free" ? "secondary" : "default"} className="capitalize">
              {tier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{currentPlan?.name ?? "Free"} Plan</p>
              <p className="text-sm text-muted-foreground">
                {currentPlan?.price === 0 ? "Free forever" : `$${currentPlan?.price}/month`}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            {tier !== "business" && (
              <Button asChild size="sm">
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            )}
            {lsCustomerId && (
              <Button variant="outline" size="sm" onClick={handleManageBilling}>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {tier === "free" && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Upgrade to Pro</CardTitle>
            <CardDescription>
              Get 200 generations/month, all platforms, and priority support for $29/month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleCheckout(PRICING_PLANS[1].variantId!)}
              disabled={loading === PRICING_PLANS[1].variantId}
            >
              {loading === PRICING_PLANS[1].variantId ? "Redirecting..." : "Upgrade to Pro – $29/mo"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
