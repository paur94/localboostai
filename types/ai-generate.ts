export type BusinessCategory =
  | "restaurant"
  | "retail"
  | "health_beauty"
  | "fitness"
  | "professional"
  | "home_services"
  | "education"
  | "entertainment"
  | "automotive"
  | "real_estate"
  | "technology"
  | "other";

export type GenerationTone =
  | "professional"
  | "casual"
  | "friendly"
  | "humorous"
  | "urgent";

export interface AIGenerationInput {
  businessName: string;
  businessCategory: BusinessCategory;
  targetAudience: string;
  promotionText: string;
  tone: GenerationTone;
  language: string;
}

export interface WeeklyScheduleDay {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  platform: string;
  contentType: string;
  topic: string;
  suggestedTime: string;
}

export interface AIGeneratedContent {
  instagramCaption: string;
  facebookPost: string;
  hashtagSet: string[];
  storyIdea: string;
  cta: string;
  weeklySchedule: WeeklyScheduleDay[];
}

export type StreamEvent =
  | { type: "start"; field: keyof AIGeneratedContent }
  | { type: "delta"; field: string; text: string }
  | { type: "complete_field"; field: string; value: string[] | WeeklyScheduleDay[] }
  | { type: "end"; field: string }
  | { type: "complete"; tokensUsed: number; generationId: string }
  | { type: "error"; message: string };
