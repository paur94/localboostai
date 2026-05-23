"use client";

import { useCallback } from "react";
import { AIGenerationForm } from "@/components/generate/ai-generation-form";
import { AIGenerationResults } from "@/components/generate/ai-generation-results";
import { useAIGenerate } from "@/hooks/use-ai-generate";
import { toast } from "@/hooks/use-toast";
import type { AIGenerationInput } from "@/types/ai-generate";

export default function AIGeneratePage() {
  const { results, activeField, isStreaming, isDone, tokensUsed, error, generate, reset } =
    useAIGenerate();

  const handleGenerate = useCallback(
    async (input: AIGenerationInput, images: File[]) => {
      await generate(input, images);
    },
    [generate]
  );

  const handleRegenerate = useCallback(() => {
    reset();
  }, [reset]);

  if (error) {
    toast({ title: "Generation failed", description: error, variant: "destructive" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Content Package</h1>
        <p className="text-muted-foreground">
          Generate an Instagram caption, Facebook post, hashtags, story idea, CTA, and a full
          weekly content schedule — all at once.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <AIGenerationForm onGenerate={handleGenerate} isStreaming={isStreaming} />

        <AIGenerationResults
          results={results}
          activeField={activeField}
          isStreaming={isStreaming}
          isDone={isDone}
          tokensUsed={tokensUsed}
          onRegenerate={isDone ? handleRegenerate : undefined}
        />
      </div>
    </div>
  );
}
