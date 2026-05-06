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

  return (
    <div className="min-h-screen flex">
      <AdminSidebar role={admin.role} />
      <div className="flex-1 flex flex-col bg-creme">
        <AdminTopBar displayName={admin.display_name} role={admin.role} />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
