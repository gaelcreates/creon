"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("Not admin");
}

function parseIds(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return (value as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function updateHomepage(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;

  const fields = {
    hero_title: (formData.get("hero_title") as string)?.trim() || null,
    hero_subtitle:
      (formData.get("hero_subtitle") as string)?.trim() || null,
    hero_cta_label:
      (formData.get("hero_cta_label") as string)?.trim() || null,
    hero_cta_url:
      (formData.get("hero_cta_url") as string)?.trim() || null,
    featured_event_ids: parseIds(formData.get("featured_event_ids")),
    featured_creator_ids: parseIds(formData.get("featured_creator_ids")),
    featured_article_ids: parseIds(formData.get("featured_article_ids")),
    banner_text: (formData.get("banner_text") as string)?.trim() || null,
    banner_active: formData.get("banner_active") === "on",
  };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("homepage_config")
    .update(fields)
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}
