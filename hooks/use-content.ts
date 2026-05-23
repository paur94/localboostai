"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import type { ContentGeneration } from "@/types/database";

export function useContent(limit = 20) {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState<ContentGeneration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient();
    supabase
      .from("content_generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [user, isLoaded, limit]);

  return { items, loading };
}
