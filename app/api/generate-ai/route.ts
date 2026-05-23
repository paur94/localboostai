import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { GENERATION_LIMITS } from "@/lib/constants";
import type {
  AIGenerationInput,
  AIGeneratedContent,
  StreamEvent,
} from "@/types/ai-generate";

// ── Prompt builder (swap mock → real AI here) ─────────────────────────────────

function buildPrompt(input: AIGenerationInput & { imageCount: number }): string {
  return `You are an expert social media content creator for local businesses.

Generate comprehensive social media content for the following business:

Business Name: ${input.businessName}
Category: ${input.businessCategory.replace(/_/g, " ")}
Target Audience: ${input.targetAudience || "general public"}
Promotion / Offer: ${input.promotionText || "none specified"}
Tone: ${input.tone}
Language: ${input.language}${input.imageCount > 0 ? `\nImages provided: ${input.imageCount} image(s) for visual reference` : ""}

Generate in ${input.language} language:
1. An Instagram caption (emojis, 150–220 chars, integrated hashtags)
2. A Facebook post (200–350 chars, conversational, community-focused)
3. 10–12 relevant hashtags as a JSON array
4. A multi-slide Instagram/Facebook Story concept
5. A compelling call-to-action paragraph
6. A 7-day weekly content schedule as a JSON array

Return ONLY the raw content, no meta-commentary.`;
}

// ── Anthropic client (reads ANTHROPIC_API_KEY from env) ───────────────────────

const anthropic = new Anthropic();

async function buildAIContent(
  input: AIGenerationInput & { imageCount: number }
): Promise<AIGeneratedContent> {
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            instagramCaption: { type: "string" },
            facebookPost: { type: "string" },
            hashtagSet: { type: "array", items: { type: "string" } },
            storyIdea: { type: "string" },
            cta: { type: "string" },
            weeklySchedule: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string", enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
                  platform: { type: "string" },
                  contentType: { type: "string" },
                  topic: { type: "string" },
                  suggestedTime: { type: "string" },
                },
                required: ["day", "platform", "contentType", "topic", "suggestedTime"],
                additionalProperties: false,
              },
            },
          },
          required: ["instagramCaption", "facebookPost", "hashtagSet", "storyIdea", "cta", "weeklySchedule"],
          additionalProperties: false,
        },
      },
    },
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const textBlock = msg.content.find((b): b is Anthropic.TextBlock => b.type === "text");
  if (!textBlock) throw new Error("No text content in AI response");
  return JSON.parse(textBlock.text) as AIGeneratedContent;
}

// ── Stream helper ──────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function encodeEvent(encoder: TextEncoder, event: StreamEvent): Uint8Array {
  return encoder.encode(JSON.stringify(event) + "\n");
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const businessName = (formData.get("businessName") as string | null)?.trim() ?? "";
  const businessCategory = (formData.get("businessCategory") as string | null)?.trim() ?? "";

  if (!businessName || !businessCategory) {
    return Response.json(
      { error: "businessName and businessCategory are required" },
      { status: 400 }
    );
  }

  const input: AIGenerationInput & { imageCount: number } = {
    businessName,
    businessCategory: businessCategory as AIGenerationInput["businessCategory"],
    targetAudience: (formData.get("targetAudience") as string | null)?.trim() ?? "",
    promotionText: (formData.get("promotionText") as string | null)?.trim() ?? "",
    tone: ((formData.get("tone") as string | null) ?? "professional") as AIGenerationInput["tone"],
    language: (formData.get("language") as string | null) ?? "en",
    imageCount: formData.getAll("images").filter((f) => f instanceof File && f.size > 0).length,
  };

  const supabase = createServerClient();

  const { data: user } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  const tier = user?.subscription_tier ?? "free";
  const limit = GENERATION_LIMITS[tier];

  if (isFinite(limit)) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const iso = startOfMonth.toISOString();

    const [{ count: legacyCount }, { count: aiCount }] = await Promise.all([
      supabase
        .from("content_generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", iso),
      supabase
        .from("ai_generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", iso),
    ]);

    if ((legacyCount ?? 0) + (aiCount ?? 0) >= limit) {
      return Response.json(
        { error: `Monthly limit of ${limit} generations reached. Please upgrade your plan.` },
        { status: 429 }
      );
    }
  }

  const content = await buildAIContent(input);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (event: StreamEvent) =>
        controller.enqueue(encodeEvent(encoder, event));

      try {
        // Stream text fields word-chunk by word-chunk
        const textFields = [
          "instagramCaption",
          "facebookPost",
          "storyIdea",
          "cta",
        ] as const;

        for (const field of textFields) {
          enqueue({ type: "start", field });

          const text = content[field];
          // Chunk at ~12 chars to balance smoothness vs. event count
          const chunks = text.match(/[\s\S]{1,12}/g) ?? [];
          for (const chunk of chunks) {
            enqueue({ type: "delta", field, text: chunk });
            await delay(10);
          }

          enqueue({ type: "end", field });
          await delay(80);
        }

        // Hashtags — reveal as one structured value
        enqueue({ type: "start", field: "hashtagSet" });
        await delay(200);
        enqueue({ type: "complete_field", field: "hashtagSet", value: content.hashtagSet });
        enqueue({ type: "end", field: "hashtagSet" });
        await delay(80);

        // Weekly schedule — reveal as one structured value
        enqueue({ type: "start", field: "weeklySchedule" });
        await delay(300);
        enqueue({
          type: "complete_field",
          field: "weeklySchedule",
          value: content.weeklySchedule,
        });
        enqueue({ type: "end", field: "weeklySchedule" });

        // Persist to DB
        const tokensUsed = Math.floor(JSON.stringify(content).length / 4);
        const { data: saved } = await supabase
          .from("ai_generations")
          .insert({
            user_id: userId,
            business_name: input.businessName,
            business_category: input.businessCategory,
            target_audience: input.targetAudience || null,
            promotion_text: input.promotionText || null,
            tone: input.tone,
            language: input.language,
            image_count: input.imageCount,
            result: content,
            tokens_used: tokensUsed,
          })
          .select("id")
          .single();

        enqueue({
          type: "complete",
          tokensUsed,
          generationId: saved?.id ?? "",
        });
      } catch (err) {
        enqueue({
          type: "error",
          message: err instanceof Error ? err.message : "Generation failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
