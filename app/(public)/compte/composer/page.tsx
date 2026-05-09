import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ComposerForm } from "./ComposerForm";
import { createPost } from "./actions";

export const metadata = {
  title: "Composer — CREON",
};

const VALID_TYPES = ["short", "article", "service"] as const;

export default async function ComposerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const initialType = VALID_TYPES.includes(
    params.type as (typeof VALID_TYPES)[number],
  )
    ? (params.type as "short" | "article" | "service")
    : "short";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    redirect("/compte");
  }

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-6 max-w-3xl mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-3">
          <Link
            href="/compte"
            className="hover:text-accent-deep transition-colors"
          >
            ← Mon compte
          </Link>
        </p>
        <p className="eyebrow text-noir-doux mb-2">Nouveau contenu</p>
        <h1 className="display-2">Composer</h1>
      </section>

      <section className="px-6 lg:px-14 pb-20 max-w-3xl mx-auto w-full">
        <ComposerForm initialType={initialType} saveAction={createPost} />
      </section>
    </>
  );
}
