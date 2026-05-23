import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { ContentGeneration } from "@/types/database";

interface RecentActivityProps {
  items: ContentGeneration[];
}

const contentTypeLabels: Record<string, string> = {
  social_post: "Social Post",
  blog_intro: "Blog Intro",
  email: "Email",
  ad_copy: "Ad Copy",
  product_description: "Product",
  seo_description: "SEO",
};

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div className="liquid-glass rounded-2xl p-6">
        <h3 className="text-base font-semibold mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No content generated yet.</p>
          <Button asChild size="sm" className="mt-4 rounded-xl">
            <Link href="/dashboard/generate">Generate your first content</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Recent Activity</h3>
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs">
          <Link href="/dashboard/history" className="flex items-center gap-1">
            View all
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/30">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs shrink-0 rounded-full">
                  {contentTypeLabels[item.content_type] ?? item.content_type}
                </Badge>
                {item.platform && (
                  <Badge variant="outline" className="text-xs shrink-0 rounded-full">{item.platform}</Badge>
                )}
              </div>
              <p className="text-sm font-medium truncate">{item.business_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{truncate(item.result, 80)}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
              {formatRelativeTime(item.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-4">
      <div className="h-5 w-36 rounded-full skeleton-shimmer" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border/30 p-3">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 rounded-full skeleton-shimmer" />
            <div className="h-3 w-64 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-3 w-12 rounded-full skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}
