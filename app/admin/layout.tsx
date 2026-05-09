import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata = {
  title: "Back-office — CREON",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) redirect("/");

  const [pendingCreatorsRes, pendingFlagsRes, newInquiriesRes] =
    await Promise.all([
      supabase
        .from("creators")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("post_flags")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("production_inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
    ]);

  return (
    <div className="min-h-screen flex">
      <AdminSidebar
        role={admin.role}
        pendingCreators={pendingCreatorsRes.count ?? 0}
        pendingFlags={pendingFlagsRes.count ?? 0}
        newInquiries={newInquiriesRes.count ?? 0}
      />
      <div className="flex-1 flex flex-col bg-creme min-w-0">
        <AdminTopBar displayName={admin.display_name} role={admin.role} />
        <div className="flex-1 p-6 lg:p-10 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
