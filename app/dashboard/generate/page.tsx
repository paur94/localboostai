"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ContentForm } from "@/components/generate/content-form";
import { ContentResult } from "@/components/generate/content-result";
import { generateContent } from "@/actions/content";
import { toast } from "@/hooks/use-toast";
import type { ContentFormData } from "@/types";

export default function GeneratePage() {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastForm, setLastForm] = useState<ContentFormData | null>(null);

  const handleGenerate = async (data: ContentFormData) => {
    setIsGenerating(true);
    setLastForm(data);
    setContent(null);

    try {
      const result = await generateContent(data);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        return;
      }
      setContent(result.content ?? null);
    } catch {
      toast({ title: "Error", description: "Failed to generate content. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (lastForm) handleGenerate(lastForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Generate Content</h1>
        <p className="text-muted-foreground">
          Create AI-powered marketing content tailored to your local business.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContentForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        <ContentResult
          content={content}
          isGenerating={isGenerating}
          onRegenerate={content ? handleRegenerate : undefined}
        />
      </div>
    </div>
  );
}
