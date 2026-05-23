"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const clerkUser = await currentUser();
  if (!clerkUser) return { error: "User not found" };

  const supabase = createServerClient();
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = clerkUser.fullName ?? clerkUser.firstName ?? null;
  const imageUrl = clerkUser.imageUrl ?? null;

  const { error } = await supabase.from("users").upsert(
    { id: userId, email, name, image_url: imageUrl },
    { onConflict: "id" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function getUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return data;
}
