import type { PricingPlan } from "@/types";

export const APP_NAME = "LocalBoost AI";
export const APP_DESCRIPTION = "AI-powered content generation for local businesses.";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for testing LocalBoost AI",
    price: 0,
    variantId: null,
    interval: "month",
    features: [
      "10 content generations/month",
      "2 platforms",
      "Basic content types",
      "Community support",
    ],
    limits: { generations: 10, platforms: 2 },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing local businesses",
    price: 29,
    variantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID ?? "",
    interval: "month",
    features: [
      "200 content generations/month",
      "All platforms",
      "All content types",
      "Custom tone & style",
      "Priority support",
      "Content history",
    ],
    limits: { generations: 200, platforms: 6 },
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For multi-location businesses",
    price: 79,
    variantId: process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID ?? "",
    interval: "month",
    features: [
      "Unlimited generations",
      "All platforms",
      "All content types",
      "Advanced customization",
      "Dedicated support",
      "Analytics dashboard",
      "API access",
    ],
    limits: { generations: Infinity, platforms: 6 },
  },
];

export const CONTENT_TYPES = [
  { value: "social_post", label: "Social Media Post" },
  { value: "blog_intro", label: "Blog Introduction" },
  { value: "email", label: "Email Campaign" },
  { value: "ad_copy", label: "Ad Copy" },
  { value: "product_description", label: "Product Description" },
  { value: "seo_description", label: "SEO Meta Description" },
] as const;

export const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "google", label: "Google Business" },
  { value: "general", label: "General" },
] as const;

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "humorous", label: "Humorous" },
  { value: "urgent", label: "Urgent" },
] as const;

export const GENERATION_LIMITS: Record<string, number> = {
  free: 10,
  pro: 200,
  business: Infinity,
};

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hy", label: "Armenian" },
  { value: "ru", label: "Russian" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
] as const;

export const BUSINESS_CATEGORIES = [
  { value: "restaurant", label: "Restaurant & Food" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "health_beauty", label: "Health & Beauty" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "professional", label: "Professional Services" },
  { value: "home_services", label: "Home Services" },
  { value: "education", label: "Education & Training" },
  { value: "entertainment", label: "Entertainment & Events" },
  { value: "automotive", label: "Automotive" },
  { value: "real_estate", label: "Real Estate" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/generate", label: "Generate", icon: "Sparkles" },
  { href: "/dashboard/history", label: "History", icon: "History" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
];
