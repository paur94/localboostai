"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface ContentResultProps {
  content: string | null;
  isGenerating: boolean;
  contentType?: string;
  platform?: string;
  onRegenerate?: () => void;
}

export function ContentResult({ content, isGenerating, contentType, platform, onRegenerate }: ContentResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `localboost-content-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isGenerating && !content) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="font-semibold mb-1">Your content will appear here</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Fill in the form and click Generate to create your AI-powered content.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">Generated Content</CardTitle>
        <div className="flex items-center gap-2">
          {contentType && <Badge variant="secondary" className="text-xs">{contentType}</Badge>}
          {platform && <Badge variant="outline" className="text-xs">{platform}</Badge>}
        </div>
      </CardHeader>

      <CardContent>
        {isGenerating ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed rounded-md bg-muted/50 p-4 min-h-[120px]">
            {content}
          </div>
        )}
      </CardContent>

      {!isGenerating && content && (
        <CardFooter className="gap-2">
          <Button size="sm" onClick={handleCopy} className="flex-1">
            {copied ? (
              <><Check className="mr-2 h-3.5 w-3.5" />Copied!</>
            ) : (
              <><Copy className="mr-2 h-3.5 w-3.5" />Copy</>
            )}
          </Button>
          {onRegenerate && (
            <Button size="sm" variant="outline" onClick={onRegenerate}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
