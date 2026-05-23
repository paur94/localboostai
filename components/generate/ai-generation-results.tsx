"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Hash,
  Camera,
  Globe,
  BookOpen,
  MousePointerClick,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import type { AIGeneratedContent, WeeklyScheduleDay } from "@/types/ai-generate";

type Field = keyof AIGeneratedContent;

const TABS: {
  id: Field;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  { id: "instagramCaption", label: "Instagram Caption", shortLabel: "Instagram", icon: Camera },
  { id: "facebookPost",     label: "Facebook Post",     shortLabel: "Facebook",  icon: Globe  },
  { id: "hashtagSet",       label: "Hashtags",           shortLabel: "Hashtags",  icon: Hash       },
  { id: "storyIdea",        label: "Story Idea",         shortLabel: "Story",     icon: BookOpen   },
  { id: "cta",              label: "Call to Action",     shortLabel: "CTA",       icon: MousePointerClick },
  { id: "weeklySchedule",   label: "Weekly Schedule",    shortLabel: "Schedule",  icon: CalendarDays },
];

interface AIGenerationResultsProps {
  results: Partial<AIGeneratedContent>;
  activeField: Field | null;
  isStreaming: boolean;
  isDone: boolean;
  tokensUsed: number;
  onRegenerate?: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 px-2">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function FieldStatus({ field, activeField, results }: {
  field: Field;
  activeField: Field | null;
  results: Partial<AIGeneratedContent>;
}) {
  if (activeField === field) {
    return <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />;
  }
  if (results[field] !== undefined) {
    return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />;
  }
  return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0" />;
}

function StreamingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

function TextContent({ text, isActive }: { text?: string; isActive: boolean }) {
  if (!text && isActive) return <StreamingSkeleton />;
  if (!text) return null;

  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed rounded-md bg-muted/50 p-4 min-h-30">
      {text}
      {isActive && (
        <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}

function HashtagContent({ tags, isActive }: { tags?: string[]; isActive: boolean }) {
  if (!tags && isActive) return <StreamingSkeleton />;
  if (!tags) return null;

  return (
    <div className="flex flex-wrap gap-2 p-4 rounded-md bg-muted/50 min-h-20">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs font-mono">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function ScheduleContent({ schedule, isActive }: { schedule?: WeeklyScheduleDay[]; isActive: boolean }) {
  if (!schedule && isActive) return <StreamingSkeleton />;
  if (!schedule) return null;

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-2 px-3 text-left font-medium text-muted-foreground">Day</th>
            <th className="py-2 px-3 text-left font-medium text-muted-foreground">Platform</th>
            <th className="py-2 px-3 text-left font-medium text-muted-foreground">Type</th>
            <th className="py-2 px-3 text-left font-medium text-muted-foreground hidden md:table-cell">Topic</th>
            <th className="py-2 px-3 text-left font-medium text-muted-foreground">Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-2 px-3 font-semibold">{row.day}</td>
              <td className="py-2 px-3">
                <Badge variant="outline" className="text-xs">{row.platform}</Badge>
              </td>
              <td className="py-2 px-3 text-muted-foreground">{row.contentType}</td>
              <td className="py-2 px-3 text-muted-foreground hidden md:table-cell max-w-60 truncate">
                {row.topic}
              </td>
              <td className="py-2 px-3 font-mono text-xs">{row.suggestedTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function copyScheduleText(schedule: WeeklyScheduleDay[]): string {
  return schedule
    .map((r) => `${r.day} | ${r.platform} | ${r.contentType} | ${r.topic} | ${r.suggestedTime}`)
    .join("\n");
}

export function AIGenerationResults({
  results,
  activeField,
  isStreaming,
  isDone,
  tokensUsed,
  onRegenerate,
}: AIGenerationResultsProps) {
  if (!isStreaming && !isDone) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="font-semibold mb-1">Your content package will appear here</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Fill in your business details and click Generate to create Instagram captions, Facebook
          posts, hashtags, story ideas, CTAs, and a full weekly schedule.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Content Package</CardTitle>
          {isStreaming && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating
            </Badge>
          )}
          {isDone && (
            <Badge variant="secondary" className="text-xs gap-1 text-emerald-600">
              <Check className="h-3 w-3" />
              Done
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDone && tokensUsed > 0 && (
            <span className="text-xs text-muted-foreground">{tokensUsed} tokens</span>
          )}
          {onRegenerate && (
            <Button size="sm" variant="outline" onClick={onRegenerate} disabled={isStreaming}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-2">
        <Tabs defaultValue="instagramCaption">
          <TabsList className="h-auto flex-wrap gap-1 mb-4">
            {TABS.map(({ id, shortLabel, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {shortLabel}
                <FieldStatus field={id} activeField={activeField} results={results} />
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Instagram Caption */}
          <TabsContent value="instagramCaption">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Instagram Caption</p>
                {results.instagramCaption && (
                  <CopyButton text={results.instagramCaption} />
                )}
              </div>
              <TextContent
                text={results.instagramCaption}
                isActive={activeField === "instagramCaption"}
              />
            </div>
          </TabsContent>

          {/* Facebook Post */}
          <TabsContent value="facebookPost">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Facebook Post</p>
                {results.facebookPost && <CopyButton text={results.facebookPost} />}
              </div>
              <TextContent
                text={results.facebookPost}
                isActive={activeField === "facebookPost"}
              />
            </div>
          </TabsContent>

          {/* Hashtags */}
          <TabsContent value="hashtagSet">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Hashtag Set</p>
                {results.hashtagSet && (
                  <CopyButton text={results.hashtagSet.join(" ")} />
                )}
              </div>
              <HashtagContent
                tags={results.hashtagSet}
                isActive={activeField === "hashtagSet"}
              />
            </div>
          </TabsContent>

          {/* Story Idea */}
          <TabsContent value="storyIdea">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Story Concept</p>
                {results.storyIdea && <CopyButton text={results.storyIdea} />}
              </div>
              <TextContent
                text={results.storyIdea}
                isActive={activeField === "storyIdea"}
              />
            </div>
          </TabsContent>

          {/* CTA */}
          <TabsContent value="cta">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Call to Action</p>
                {results.cta && <CopyButton text={results.cta} />}
              </div>
              <TextContent text={results.cta} isActive={activeField === "cta"} />
            </div>
          </TabsContent>

          {/* Weekly Schedule */}
          <TabsContent value="weeklySchedule">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">7-Day Content Plan</p>
                {results.weeklySchedule && (
                  <CopyButton text={copyScheduleText(results.weeklySchedule)} />
                )}
              </div>
              <ScheduleContent
                schedule={results.weeklySchedule}
                isActive={activeField === "weeklySchedule"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
