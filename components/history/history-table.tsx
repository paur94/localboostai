"use client";

import { useState } from "react";
import { Copy, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { ContentGeneration } from "@/types/database";

interface HistoryTableProps {
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

export function HistoryTable({ items }: HistoryTableProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContentGeneration | null>(null);

  const filtered = items.filter(
    (item) =>
      item.business_name.toLowerCase().includes(search.toLowerCase()) ||
      item.content_type.toLowerCase().includes(search.toLowerCase()) ||
      item.result.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="font-semibold mb-1">No content history yet</h3>
        <p className="text-sm text-muted-foreground">
          Generated content will appear here once you start creating.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} items</span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Platform</TableHead>
              <TableHead className="hidden lg:table-cell">Content Preview</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <TableCell className="font-medium">{item.business_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {contentTypeLabels[item.content_type] ?? item.content_type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.platform ? (
                    <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {truncate(item.result, 60)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {formatRelativeTime(item.created_at)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy(item.result)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selected.business_name}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary">{contentTypeLabels[selected.content_type] ?? selected.content_type}</Badge>
              {selected.platform && <Badge variant="outline">{selected.platform}</Badge>}
            </div>
            <div className="whitespace-pre-wrap text-sm rounded-md bg-muted/50 p-4 max-h-[300px] overflow-y-auto">
              {selected.result}
            </div>
            <Button onClick={() => handleCopy(selected.result)} className="mt-2">
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
