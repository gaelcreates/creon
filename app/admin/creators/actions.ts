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

export async function approveCreator(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const admin = createAdminClient();
  const { data: creator, error: fetchErr } = await admin
    .from("creators")
    .select("email, display_name")
    .eq("id", id)
    .maybeSingle();
  if (fetchErr || !creator) throw new Error("Creator not found");

  const { error: updateErr } = await admin
    .from("creators")
    .update({ status: "active" })
    .eq("id", id);
  if (updateErr) throw updateErr;

  await admin.auth.signInWithOtp({
    email: creator.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/`,
    },
  });

  revalidatePath("/admin/creators");
  revalidatePath("/admin");
}

export async function rejectCreator(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const admin = createAdminClient();
  const { error } = await admin.from("creators").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/creators");
  revalidatePath("/admin");
}

export async function suspendCreator(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const admin = createAdminClient();
  const { error } = await admin
    .from("creators")
    .update({ status: "suspended" })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/creators");
}

export async function reactivateCreator(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const admin = createAdminClient();
  const { error } = await admin
    .from("creators")
    .update({ status: "active" })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/creators");
}
