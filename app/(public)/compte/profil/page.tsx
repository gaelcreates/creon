import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompteForm } from "../CompteForm";
import { updateMyProfile, deleteMyAccount } from "../actions";

export const metadata = {
  title: "Modifier mon profil — CREON",
};

type LinkItem = { label: string; url: string; type?: string };

type CreatorRow = {
  id: string;
  email: string;
  handle: string;
  display_name: string;
  short_bio: string | null;
  long_bio: string | null;
  profile_image: string | null;
  cover_image: string | null;
  city: string | null;
  canton: string | null;
  categories: string[];
  links: LinkItem[];
  status: "pending" | "active" | "suspended";
};

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const saved = params.saved === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select(
      "id, email, handle, display_name, short_bio, long_bio, profile_image, cover_image, city, canton, categories, links, status",
    )
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    redirect("/compte");
  }

  const c = creator as CreatorRow;

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
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow text-noir-doux mb-2">Espace privé</p>
            <h1 className="display-2">
              Mon <span className="hl">profil</span>
            </h1>
          </div>
          <Link
            href={`/createurs/${c.handle}`}
            target="_blank"
            className="mono-meta text-noir-doux hover:text-accent-deep transition-colors shrink-0"
          >
            Voir ma page publique ↗
          </Link>
        </div>
        {saved && (
          <div className="mt-6 border border-accent bg-accent-soft px-4 py-3 rounded-md font-body text-[14px]">
            ✓ Profil enregistré.
          </div>
        )}
      </section>

      <section className="px-6 lg:px-14 pb-20 max-w-3xl mx-auto w-full">
        <CompteForm
          creator={{
            id: c.id,
            email: c.email,
            handle: c.handle,
            display_name: c.display_name,
            short_bio: c.short_bio,
            long_bio: c.long_bio,
            profile_image: c.profile_image,
            cover_image: c.cover_image,
            city: c.city,
            canton: c.canton,
            categories: c.categories,
            links: c.links ?? [],
          }}
          saveAction={updateMyProfile}
          deleteAction={deleteMyAccount}
        />
      </section>
    </>
  );
}
