import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";
import { BillingSection } from "@/components/settings/billing-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/types/database";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  let dbUser: User | null = null;

  if (userId) {
    const { data } = await createServerClient()
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    dbUser = data;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and billing preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <SettingsForm
            defaultValues={{
              name: clerkUser?.fullName ?? "",
              email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? "",
            }}
          />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingSection
            tier={dbUser?.subscription_tier ?? "free"}
            lsCustomerId={dbUser?.lemon_squeezy_customer_id ?? null}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>
      <p className="text-sm text-muted-foreground">
        Notification settings are managed through your email provider. We&apos;ll send you updates on your plan and usage.
      </p>
    </div>
  );
}
