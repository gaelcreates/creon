"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitInquiry(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const company = (formData.get("company") as string)?.trim() || null;
  const project_type = (formData.get("project_type") as string)?.trim();
  const budget_range = (formData.get("budget_range") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !project_type || !message) {
    redirect(
      `/productions?error=${encodeURIComponent("Tous les champs requis ne sont pas remplis")}`,
    );
  }
  if (!email.includes("@")) {
    redirect(
      `/productions?error=${encodeURIComponent("Email invalide")}`,
    );
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("production_inquiries").insert({
    name,
    email,
    phone,
    company,
    project_type,
    budget_range,
    message,
  });

  if (error) {
    redirect(`/productions?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/productions?sent=1#contact");
}
