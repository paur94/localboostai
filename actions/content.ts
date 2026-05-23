"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { GENERATION_LIMITS } from "@/lib/constants";
import type { ContentFormData, GenerateContentResult } from "@/types";

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

function generateMockContent(data: ContentFormData): string {
  const templates: Record<string, string> = {
    social_post: `✨ ${data.businessName} is here to elevate your experience!

${data.businessDescription.slice(0, 100)}...

Ready to discover something amazing? Visit us today and see why our community loves us! 🌟

#LocalBusiness #${data.businessName.replace(/\s/g, "")} #Community`,
    blog_intro: `If you're looking for ${data.businessDescription.slice(0, 60).toLowerCase()}, look no further than ${data.businessName}.

Nestled in the heart of our community, ${data.businessName} has been delivering exceptional experiences that keep customers coming back. But what makes us truly special isn't just what we offer — it's how we offer it.

In this post, we'll take you behind the scenes of ${data.businessName} and show you exactly why we've become a local favorite.`,
    email: `Subject: Something Special from ${data.businessName} Just for You 🎉

Hi there,

We have some exciting news to share from ${data.businessName}!

${data.businessDescription.slice(0, 150)}

We believe every customer deserves the very best, which is why we're constantly working to bring you even more value.

Ready to experience it for yourself? Visit us or reach out today — we'd love to see you!

Warm regards,
The ${data.businessName} Team`,
    ad_copy: `HEADLINE: ${data.businessName} — Quality You Can Count On

${data.businessDescription.slice(0, 120)}

✅ Local & trusted
✅ Exceptional quality
✅ Community focused

👉 Don't wait — discover ${data.businessName} today!`,
    product_description: `Discover what ${data.businessName} has to offer. ${data.businessDescription}

Our commitment to quality and customer satisfaction sets us apart. Whether you're a first-time visitor or a loyal customer, we deliver an experience that keeps you coming back.`,
    seo_description: `${data.businessName} — ${data.businessDescription.slice(0, 90)}. Trusted by the local community. Visit us today!`,
  };

  return templates[data.contentType] ?? templates.social_post;
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

  const content = generateMockContent(data);
  const tokensUsed = Math.floor(content.length / 4);

  await supabase.from("content_generations").insert({
    user_id: userId,
    content_type: data.contentType,
    platform: data.platform,
    business_name: data.businessName,
    prompt: buildPrompt(data),
    result: content,
    tokens_used: tokensUsed,
  });

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
