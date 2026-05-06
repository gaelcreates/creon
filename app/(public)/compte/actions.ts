"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireCreator() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not authenticated");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, email, handle")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator) throw new Error("No creator profile linked to this account");
  return { user, creator };
}

type LinkItem = { label: string; url: string; type?: string };

function parseLinks(raw: string | null): LinkItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is LinkItem =>
          typeof l === "object" &&
          l !== null &&
          typeof l.label === "string" &&
          typeof l.url === "string" &&
          l.label.length > 0 &&
          l.url.length > 0,
      )
      .map((l) => ({
        label: l.label.trim(),
        url: l.url.trim(),
        type: typeof l.type === "string" ? l.type : undefined,
      }));
  } catch {
    return [];
  }
}

export async function updateMyProfile(formData: FormData) {
  const { creator } = await requireCreator();

  const newHandle = (formData.get("handle") as string)?.trim();
  const display_name = (formData.get("display_name") as string)?.trim();
  const short_bio = (formData.get("short_bio") as string)?.trim() || null;
  const long_bio = (formData.get("long_bio") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const canton = (formData.get("canton") as string)?.trim() || null;
  const profile_image =
    (formData.get("profile_image") as string)?.trim() || null;
  const cover_image =
    (formData.get("cover_image") as string)?.trim() || null;
  const cats = (formData.get("categories") as string)
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean) ?? [];
  const links = parseLinks(formData.get("links") as string);

  if (!display_name) throw new Error("Display name required");
  if (!newHandle || !/^[a-z0-9-]+$/.test(newHandle)) {
    throw new Error(
      "Handle invalide. Lettres minuscules, chiffres et tirets uniquement.",
    );
  }

  const adminClient = createAdminClient();

  if (newHandle !== creator.handle) {
    const { data: collision } = await adminClient
      .from("creators")
      .select("id")
      .eq("handle", newHandle)
      .neq("id", creator.id)
      .maybeSingle();
    if (collision) {
      throw new Error("Ce handle est déjà pris.");
    }
  }

  const { error } = await adminClient
    .from("creators")
    .update({
      handle: newHandle,
      display_name,
      short_bio,
      long_bio,
      city,
      canton,
      profile_image,
      cover_image,
      categories: cats,
      links,
    })
    .eq("id", creator.id);

  if (error) throw error;

  revalidatePath("/compte");
  revalidatePath(`/createurs/${newHandle}`);
  if (newHandle !== creator.handle) {
    revalidatePath(`/createurs/${creator.handle}`);
  }
  redirect("/compte?saved=1");
}

export async function deleteMyAccount() {
  const { creator } = await requireCreator();

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("creators")
    .update({ status: "suspended" })
    .eq("id", creator.id);
  if (error) throw error;

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?account=removed");
}
