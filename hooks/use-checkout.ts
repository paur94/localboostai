"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function useCheckout() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (variantId: string) => {
    setLoading(variantId);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      router.push(data.url);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return { handleCheckout, loading };
}
