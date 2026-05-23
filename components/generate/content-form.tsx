"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CONTENT_TYPES, PLATFORMS, TONES } from "@/lib/constants";
import type { ContentFormData } from "@/types";

interface ContentFormProps {
  onGenerate: (data: ContentFormData) => Promise<void>;
  isGenerating: boolean;
}

export function ContentForm({ onGenerate, isGenerating }: ContentFormProps) {
  const [form, setForm] = useState<ContentFormData>({
    contentType: "social_post",
    platform: "instagram",
    businessName: "",
    businessDescription: "",
    tone: "professional",
    additionalContext: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.businessDescription.trim()) return;
    onGenerate(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Content</CardTitle>
        <CardDescription>
          Tell us about your business and we&apos;ll create compelling content for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) => setForm((p) => ({ ...p, contentType: v as ContentFormData["contentType"] }))}
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm((p) => ({ ...p, platform: v as ContentFormData["platform"] }))}
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="e.g. Fresh Bites Café"
              value={form.businessName}
              onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              placeholder="Describe your business, products/services, and target audience..."
              value={form.businessDescription}
              onChange={(e) => setForm((p) => ({ ...p, businessDescription: e.target.value }))}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={form.tone}
              onValueChange={(v) => setForm((p) => ({ ...p, tone: v as ContentFormData["tone"] }))}
            >
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalContext">
              Additional Context <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="additionalContext"
              placeholder="Any promotions, keywords, or specific details to include..."
              value={form.additionalContext}
              onChange={(e) => setForm((p) => ({ ...p, additionalContext: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
