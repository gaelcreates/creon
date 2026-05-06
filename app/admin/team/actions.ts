"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: admin } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (admin?.role !== "super_admin") throw new Error("Not super admin");
}

type AddAdminResult =
  | { ok: true }
  | { ok: false; error: string };

export async function addAdmin(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const display_name = (formData.get("display_name") as string)?.trim();
  const role = formData.get("role") as string;

  if (!email || !display_name || !role) {
    return;
  }
  if (role !== "admin" && role !== "editor" && role !== "super_admin") {
    return;
  }

  const adminClient = createAdminClient();

  const { data: existingUsers } = await adminClient.auth.admin.listUsers();
  let userId = existingUsers?.users.find(
    (u) => u.email?.toLowerCase() === email,
  )?.id;

  if (!userId) {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error: insertErr } = await adminClient.from("admins").upsert(
    {
      id: userId,
      email,
      display_name,
      role,
    },
    { onConflict: "id" },
  );
  if (insertErr) throw insertErr;

  await adminClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin`,
    },
  });

  revalidatePath("/admin/team");
}

export async function removeAdmin(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("admins").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/team");
}

export async function updateAdminRole(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = formData.get("id") as string;
  const role = formData.get("role") as string;
  if (!id || !role) return;
  if (role !== "admin" && role !== "editor" && role !== "super_admin") return;

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("admins")
    .update({ role })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/team");
}
