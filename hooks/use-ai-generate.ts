"use client";

import { useState, useCallback } from "react";
import type {
  AIGenerationInput,
  AIGeneratedContent,
  StreamEvent,
  WeeklyScheduleDay,
} from "@/types/ai-generate";

interface AIGenerateState {
  results: Partial<AIGeneratedContent>;
  activeField: keyof AIGeneratedContent | null;
  isStreaming: boolean;
  isDone: boolean;
  error: string | null;
  tokensUsed: number;
  generationId: string | null;
}

const INITIAL_STATE: AIGenerateState = {
  results: {},
  activeField: null,
  isStreaming: false,
  isDone: false,
  error: null,
  tokensUsed: 0,
  generationId: null,
};

export function useAIGenerate() {
  const [state, setState] = useState<AIGenerateState>(INITIAL_STATE);

  const generate = useCallback(async (input: AIGenerationInput, images: File[]) => {
    setState({ ...INITIAL_STATE, isStreaming: true });

    const formData = new FormData();
    formData.append("businessName", input.businessName);
    formData.append("businessCategory", input.businessCategory);
    formData.append("targetAudience", input.targetAudience);
    formData.append("promotionText", input.promotionText);
    formData.append("tone", input.tone);
    formData.append("language", input.language);
    for (const img of images) {
      formData.append("images", img);
    }

    let response: Response;
    try {
      response = await fetch("/api/generate-ai", { method: "POST", body: formData });
    } catch {
      setState((s) => ({ ...s, isStreaming: false, error: "Network error. Please try again." }));
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Request failed" }));
      setState((s) => ({
        ...s,
        isStreaming: false,
        error: (body as { error?: string }).error ?? "Request failed",
      }));
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          let event: StreamEvent;
          try {
            event = JSON.parse(line) as StreamEvent;
          } catch {
            continue;
          }

          switch (event.type) {
            case "start":
              setState((s) => ({ ...s, activeField: event.field }));
              break;

            case "delta":
              setState((s) => ({
                ...s,
                results: {
                  ...s.results,
                  [event.field]:
                    ((s.results[event.field as keyof AIGeneratedContent] as string) ?? "") +
                    event.text,
                },
              }));
              break;

            case "complete_field":
              setState((s) => ({
                ...s,
                results: {
                  ...s.results,
                  [event.field]: event.value as string[] | WeeklyScheduleDay[],
                },
              }));
              break;

            case "end":
              setState((s) => ({
                ...s,
                activeField: s.activeField === event.field ? null : s.activeField,
              }));
              break;

            case "complete":
              setState((s) => ({
                ...s,
                isStreaming: false,
                isDone: true,
                activeField: null,
                tokensUsed: event.tokensUsed,
                generationId: event.generationId,
              }));
              break;

            case "error":
              setState((s) => ({ ...s, isStreaming: false, error: event.message }));
              break;
          }
        }
      }
    } catch (err) {
      setState((s) => ({
        ...s,
        isStreaming: false,
        error: err instanceof Error ? err.message : "Unexpected error",
      }));
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, generate, reset };
}
