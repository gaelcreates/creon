import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { getAuthState } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [auth, configRes] = await Promise.all([
    getAuthState(),
    supabase
      .from("homepage_config")
      .select("banner_text, banner_active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const bannerText =
    configRes.data?.banner_active && configRes.data.banner_text
      ? configRes.data.banner_text
      : null;

  return (
    <>
      <Header
        creator={auth.creator}
        isAdmin={auth.isAdmin}
        bannerText={bannerText}
      />
      <ScrollProgress />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
