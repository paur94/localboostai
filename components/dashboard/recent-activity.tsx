import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No content generated yet.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/generate">Generate your first content</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/history" className="flex items-center gap-1 text-xs">
            View all
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-lg border p-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs shrink-0">
                  {contentTypeLabels[item.content_type] ?? item.content_type}
                </Badge>
                {item.platform && (
                  <Badge variant="outline" className="text-xs shrink-0">{item.platform}</Badge>
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
      </CardContent>
    </Card>
  );
}
