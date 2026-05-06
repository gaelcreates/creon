import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompteForm } from "./CompteForm";
import { updateMyProfile, deleteMyAccount } from "./actions";

export const metadata = {
  title: "Mon compte — CREON",
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

export default async function ComptePage({
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

  if (!creator) {
    return (
      <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
        <p className="eyebrow text-noir-doux">Pas de profil créateur</p>
        <h1 className="font-display text-5xl leading-tight">
          Cet email n&apos;a pas de profil créateur lié.
        </h1>
        <p className="font-body text-base leading-relaxed">
          Tu es peut-être membre de l&apos;équipe sans être créateur, ou ta
          candidature est en attente. Si tu penses que c&apos;est une erreur,
          écris à{" "}
          <a
            href="mailto:hello@creon.ch"
            className="text-accent border-b-2 border-accent"
          >
            hello@creon.ch
          </a>
          .
        </p>
        <div className="pt-4">
          <Link
            href="/proposer-mon-profil"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            Proposer mon profil →
          </Link>
        </div>
      </section>
    );
  }

  const c = creator as CreatorRow;

  if (c.status === "pending") {
    return (
      <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
        <p className="eyebrow text-noir-doux">Candidature en attente</p>
        <h1 className="font-display text-5xl leading-tight">
          Ta candidature est en cours de relecture.
        </h1>
        <p className="font-body text-base leading-relaxed">
          On lit chaque candidature manuellement. Dès qu&apos;elle est
          approuvée, tu reçois un email et tu auras accès à cet espace pour
          finaliser ton profil.
        </p>
      </section>
    );
  }

  if (c.status === "suspended") {
    return (
      <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
        <p className="eyebrow text-noir-doux">Compte suspendu</p>
        <h1 className="font-display text-5xl leading-tight">
          Ton profil est actuellement suspendu.
        </h1>
        <p className="font-body text-base leading-relaxed">
          Pour réactiver ton compte ou comprendre pourquoi il est suspendu,
          contacte{" "}
          <a
            href="mailto:hello@creon.ch"
            className="text-accent border-b-2 border-accent"
          >
            hello@creon.ch
          </a>
          .
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-8 max-w-3xl mx-auto w-full">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow text-noir-doux mb-2">Espace privé</p>
            <h1 className="font-display text-5xl sm:text-7xl leading-[0.86] tracking-tight">
              Mon <span className="hl-block">profil</span>
            </h1>
          </div>
          <Link
            href={`/createurs/${c.handle}`}
            target="_blank"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep shrink-0 mt-3"
          >
            Voir ma page publique ↗
          </Link>
        </div>
        {saved && (
          <div className="mt-6 border-2 border-noir bg-accent px-4 py-3 font-body text-sm">
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
