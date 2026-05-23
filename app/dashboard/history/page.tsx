import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { HistoryTable } from "@/components/history/history-table";
import type { ContentGeneration } from "@/types/database";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const { userId } = await auth();
  let items: ContentGeneration[] = [];

  if (userId) {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("content_generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    items = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content History</h1>
        <p className="text-muted-foreground">Browse and reuse your previously generated content.</p>
      </div>

      <HistoryTable items={items} />
    </div>
  );
}
