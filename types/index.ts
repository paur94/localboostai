export * from "./database";
export * from "./ai-generate";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  variantId: string | null;
  interval: "month" | "year";
  features: string[];
  limits: {
    generations: number;
    platforms: number;
  };
  popular?: boolean;
}

export interface ContentFormData {
  contentType: import("./database").ContentType;
  platform: import("./database").Platform;
  businessName: string;
  businessDescription: string;
  tone: "professional" | "casual" | "friendly" | "humorous" | "urgent";
  additionalContext?: string;
  generateImage?: boolean;
}

export interface GenerateContentResult {
  content: string;
  tokensUsed: number;
}

export interface DashboardStats {
  totalGenerations: number;
  generationsThisMonth: number;
  tokensUsed: number;
  subscriptionTier: import("./database").SubscriptionTier;
}
