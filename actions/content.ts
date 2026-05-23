"use server";

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { GENERATION_LIMITS } from "@/lib/constants";
import type { ContentFormData, GenerateContentResult } from "@/types";

const anthropic = new Anthropic();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(data: ContentFormData): string {
  const platformMap: Record<string, string> = {
    instagram: "Instagram (use emojis, hashtags, engaging visual hooks, 150–220 characters)",
    facebook: "Facebook (conversational, community-focused, 100–250 characters)",
    twitter: "X/Twitter (concise, punchy, under 280 characters)",
    linkedin: "LinkedIn (professional, value-driven, 150–300 characters)",
    google: "Google Business (informative, local SEO-friendly, 150–200 characters)",
    general: "general use (clear, engaging, flexible length)",
  };

  const contentMap: Record<string, string> = {
    social_post: "social media post",
    blog_intro: "blog post introduction (2–3 paragraphs)",
    email: "marketing email with subject line",
    ad_copy: "advertising copy with headline and body",
    product_description: "product/service description",
    seo_description: "SEO meta description (under 160 characters)",
  };

  return `You are an expert marketing copywriter for local businesses.

Write a ${contentMap[data.contentType] ?? data.contentType} for the following business:

Business Name: ${data.businessName}
Description: ${data.businessDescription}
Platform: ${platformMap[data.platform] ?? data.platform}
Tone: ${data.tone}
${data.additionalContext ? `Additional Context: ${data.additionalContext}` : ""}

Requirements:
- Write in a ${data.tone} tone
- Optimize for ${data.platform}
- Include a clear call-to-action
- Make it specific to "${data.businessName}"
- Keep it authentic and avoid generic filler phrases

Return ONLY the content, no explanations or meta-commentary.`;
}

async function generateLiveContent(data: ContentFormData): Promise<{ content: string; tokensUsed: number }> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: "You are an expert marketing copywriter for local businesses. Return ONLY the requested content with no explanations or meta-commentary.",
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: buildPrompt(data) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const content = textBlock?.type === "text" ? textBlock.text : "";
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  return { content, tokensUsed };
}

export async function generateContent(
  data: ContentFormData
): Promise<{ content?: string; error?: string; tokensUsed?: number }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

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

    const { count } = await supabase
      .from("content_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= limit) {
      return { error: `You've reached your monthly limit of ${limit} generations. Please upgrade your plan.` };
    }
  }

  const { content, tokensUsed } = await generateLiveContent(data);

  await supabase.from("content_generations").insert({
    user_id: userId,
    content_type: data.contentType,
    platform: data.platform,
    business_name: data.businessName,
    prompt: buildPrompt(data),
    result: content,
    tokens_used: tokensUsed,
  });

  revalidatePath("/dashboard");

  return { content, tokensUsed };
}

export async function deleteGeneration(id: string): Promise<{ error?: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const supabase = createServerClient();
  const { error } = await supabase
    .from("content_generations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  return {};
}

export async function generateImage(
  data: ContentFormData
): Promise<{ imageUrl?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const platformStyle: Record<string, string> = {
    instagram: "vibrant, eye-catching, square-format social media style",
    facebook: "warm, community-focused, engaging",
    twitter: "bold, punchy, modern",
    linkedin: "professional, clean, corporate",
    google: "local business, friendly, trustworthy",
    general: "versatile, professional, modern",
  };

  const prompt = `A high-quality marketing image for "${data.businessName}", a local business: ${data.businessDescription}. ${platformStyle[data.platform] ?? "professional"} style, ${data.tone} mood. No text overlays. Photorealistic.`;

  let response;
  try {
    response = await openai.images.generate({
      model: "gpt-image-2",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "high",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Billing hard limit")) {
      return { error: "Image generation is temporarily unavailable. Please try again later." };
    }
    return { error: "Failed to generate image. Please try again." };
  }

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) return { error: "No image returned from OpenAI." };

  const imageUrl = `data:image/png;base64,${b64}`;
  return { imageUrl };
}
