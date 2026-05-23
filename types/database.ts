export type SubscriptionTier = "free" | "pro" | "business";

export type ContentType =
  | "social_post"
  | "blog_intro"
  | "email"
  | "ad_copy"
  | "product_description"
  | "seo_description";

export type Platform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "google"
  | "general";

export type BusinessTone =
  | "professional"
  | "casual"
  | "friendly"
  | "humorous"
  | "urgent";

export type CalendarStatus = "active" | "completed" | "archived";

export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export type SocialHandles = Partial<Record<Platform, string>>;

// ── Row types ─────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  email: string;
  name: string | null;
  image_url: string | null;
  subscription_tier: SubscriptionTier;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessProfile = {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  industry: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  social_handles: SocialHandles;
  logo_url: string | null;
  tone: BusinessTone;
  target_audience: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentCalendar = {
  id: string;
  business_profile_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: CalendarStatus;
  created_at: string;
  updated_at: string;
};

export type GeneratedPost = {
  id: string;
  business_profile_id: string;
  content_calendar_id: string | null;
  content_type: ContentType;
  platform: Platform | null;
  prompt: string;
  content: string;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  tokens_used: number;
  created_at: string;
  updated_at: string;
};

export type ContentGeneration = {
  id: string;
  user_id: string;
  content_type: ContentType;
  platform: Platform | null;
  business_name: string;
  prompt: string;
  result: string;
  tokens_used: number;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
};

// ── Supabase Database type ─────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          image_url?: string | null;
          subscription_tier?: SubscriptionTier;
          lemon_squeezy_customer_id?: string | null;
          lemon_squeezy_subscription_id?: string | null;
        };
        Update: {
          email?: string;
          name?: string | null;
          image_url?: string | null;
          subscription_tier?: SubscriptionTier;
          lemon_squeezy_customer_id?: string | null;
          lemon_squeezy_subscription_id?: string | null;
        };
        Relationships: [];
      };
      business_profiles: {
        Row: BusinessProfile;
        Insert: {
          user_id: string;
          business_name: string;
          description?: string | null;
          industry?: string | null;
          website?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          social_handles?: SocialHandles;
          logo_url?: string | null;
          tone?: BusinessTone;
          target_audience?: string | null;
        };
        Update: {
          business_name?: string;
          description?: string | null;
          industry?: string | null;
          website?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          social_handles?: SocialHandles;
          logo_url?: string | null;
          tone?: BusinessTone;
          target_audience?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      content_calendars: {
        Row: ContentCalendar;
        Insert: {
          business_profile_id: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          status?: CalendarStatus;
        };
        Update: {
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          status?: CalendarStatus;
        };
        Relationships: [
          {
            foreignKeyName: "content_calendars_business_profile_id_fkey";
            columns: ["business_profile_id"];
            referencedRelation: "business_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      generated_posts: {
        Row: GeneratedPost;
        Insert: {
          business_profile_id: string;
          content_calendar_id?: string | null;
          content_type: ContentType;
          platform?: Platform | null;
          prompt: string;
          content: string;
          status?: PostStatus;
          scheduled_at?: string | null;
          published_at?: string | null;
          tokens_used?: number;
        };
        Update: {
          content_calendar_id?: string | null;
          content?: string;
          status?: PostStatus;
          scheduled_at?: string | null;
          published_at?: string | null;
          tokens_used?: number;
        };
        Relationships: [
          {
            foreignKeyName: "generated_posts_business_profile_id_fkey";
            columns: ["business_profile_id"];
            referencedRelation: "business_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_posts_content_calendar_id_fkey";
            columns: ["content_calendar_id"];
            referencedRelation: "content_calendars";
            referencedColumns: ["id"];
          }
        ];
      };
      content_generations: {
        Row: ContentGeneration;
        Insert: {
          user_id: string;
          content_type: ContentType;
          platform?: Platform | null;
          business_name: string;
          prompt: string;
          result: string;
          tokens_used?: number;
        };
        Update: {
          result?: string;
          tokens_used?: number;
        };
        Relationships: [];
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_category: string;
          target_audience: string | null;
          promotion_text: string | null;
          tone: string;
          language: string;
          image_count: number;
          result: import("./ai-generate").AIGeneratedContent | null;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          business_name: string;
          business_category: string;
          target_audience?: string | null;
          promotion_text?: string | null;
          tone?: string;
          language?: string;
          image_count?: number;
          result?: import("./ai-generate").AIGeneratedContent | null;
          tokens_used?: number;
        };
        Update: {
          result?: import("./ai-generate").AIGeneratedContent | null;
          tokens_used?: number;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: {
          id: string;
          user_id: string;
          status: Subscription["status"];
          price_id: string;
          current_period_start?: string;
          current_period_end?: string;
        };
        Update: {
          status?: Subscription["status"];
          price_id?: string;
          current_period_start?: string;
          current_period_end?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
