"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, randomSuffix } from "@/lib/slug";

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
  return user;
}

function extractEventFields(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  if (!slug) slug = `${slugify(title)}-${randomSuffix(4)}`;

  const linkedCreator = formData.get("linked_creator") as string;
  const dateStart = formData.get("date_start") as string;
  const dateEnd = formData.get("date_end") as string;

  const cats = (formData.get("categories") as string)
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean) ?? [];

  const status = formData.get("status") as
    | "draft"
    | "published"
    | "archived";

  const featured = formData.get("featured") === "on";

  return {
    title,
    slug,
    short_description:
      (formData.get("short_description") as string)?.trim() || null,
    cover_image: (formData.get("cover_image") as string)?.trim() || null,
    date_start: new Date(dateStart).toISOString(),
    date_end: dateEnd ? new Date(dateEnd).toISOString() : null,
    city: (formData.get("city") as string).trim(),
    venue: (formData.get("venue") as string).trim(),
    venue_address:
      (formData.get("venue_address") as string)?.trim() || null,
    categories: cats,
    external_url: (formData.get("external_url") as string)?.trim() || null,
    external_label:
      (formData.get("external_label") as string)?.trim() || "S'inscrire",
    price_info: (formData.get("price_info") as string)?.trim() || null,
    linked_creator: linkedCreator || null,
    status,
    featured,
  };
}

export async function createEvent(formData: FormData) {
  const user = await requireAdmin();
  const fields = extractEventFields(formData);

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("events")
    .insert({
      ...fields,
      created_by: user.id,
      published_at:
        fields.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ce slug est déjà utilisé. Change-le et ré-essaie.");
    }
    throw error;
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  redirect(`/admin/events/${data.id}`);
}

export async function updateEvent(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const fields = extractEventFields(formData);
  const adminClient = createAdminClient();

  const { data: existing } = await adminClient
    .from("events")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const published_at =
    fields.status === "published" && !existing?.published_at
      ? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await adminClient
    .from("events")
    .update({ ...fields, published_at })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/events/${id}`);
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("events").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  redirect("/admin/events");
}
