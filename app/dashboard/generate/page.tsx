"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ContentForm } from "@/components/generate/content-form";
import { ContentResult } from "@/components/generate/content-result";
import { generateContent, generateImage } from "@/actions/content";
import { toast } from "@/hooks/use-toast";
import type { ContentFormData } from "@/types";

export default function GeneratePage() {
  const [content, setContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastForm, setLastForm] = useState<ContentFormData | null>(null);

  const handleGenerate = async (data: ContentFormData) => {
    setIsGenerating(true);
    setLastForm(data);
    setContent(null);
    setImageUrl(null);

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

    if (data.generateImage) {
      setIsGeneratingImage(true);
      try {
        const imgResult = await generateImage(data);
        if (imgResult.error) {
          toast({ title: "Image Error", description: imgResult.error, variant: "destructive" });
        } else {
          setImageUrl(imgResult.imageUrl ?? null);
        }
      } catch {
        toast({ title: "Image Error", description: "Failed to generate image. Please try again.", variant: "destructive" });
      } finally {
        setIsGeneratingImage(false);
      }
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
          imageUrl={imageUrl}
          isGeneratingImage={isGeneratingImage}
          onRegenerate={content ? handleRegenerate : undefined}
        />
      </div>
    </div>
  );
}
