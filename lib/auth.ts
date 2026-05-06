import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthCreator = {
  handle: string;
  display_name: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  creator: AuthCreator | null;
  isAdmin: boolean;
};

export async function getAuthState(): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { user: null, creator: null, isAdmin: false };
  }

  const [creatorRes, adminRes] = await Promise.all([
    supabase
      .from("creators")
      .select("handle, display_name")
      .eq("email", user.email)
      .eq("status", "active")
      .maybeSingle(),
    supabase.from("admins").select("id").eq("id", user.id).maybeSingle(),
  ]);

  return {
    user: { id: user.id, email: user.email },
    creator: creatorRes.data ?? null,
    isAdmin: adminRes.data !== null,
  };
}

export async function logout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
