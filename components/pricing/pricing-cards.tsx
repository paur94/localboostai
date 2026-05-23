"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/constants";
import { useCheckout } from "@/hooks/use-checkout";

export function PricingCards() {
  const { handleCheckout, loading } = useCheckout();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PRICING_PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "relative flex flex-col",
            plan.popular && "border-primary shadow-lg scale-105"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="pt-2">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground text-sm">/{plan.interval}</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            {plan.price === 0 ? (
              <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            ) : (
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.variantId!)}
                disabled={loading === plan.variantId}
              >
                {loading === plan.variantId ? "Redirecting..." : `Start ${plan.name}`}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
