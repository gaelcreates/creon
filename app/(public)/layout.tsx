import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAuthState } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthState();
  return (
    <>
      <Header creator={auth.creator} isAdmin={auth.isAdmin} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
