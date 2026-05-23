"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import type { SubscriptionTier } from "@/types/database";

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
}

export function useSubscription(): SubscriptionState {
  const { user, isLoaded } = useUser();
  const [state, setState] = useState<SubscriptionState>({ tier: "free", loading: true });

  useEffect(() => {
    if (!isLoaded || !user) {
      setState({ tier: "free", loading: false });
      return;
    }

    const supabase = createBrowserClient();
    supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setState({ tier: (data?.subscription_tier as SubscriptionTier) ?? "free", loading: false });
      });
  }, [user, isLoaded]);

  return state;
}
