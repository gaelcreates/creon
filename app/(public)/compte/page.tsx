import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export const metadata = {
  title: "Mon compte — CREON",
};

type CreatorRow = {
  id: string;
  email: string;
  handle: string;
  display_name: string;
  profile_image: string | null;
  city: string | null;
  status: "pending" | "active" | "suspended";
};

type PostRow = {
  id: string;
  slug: string;
  type: "short" | "article" | "service";
  title: string | null;
  status: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
};

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

const TYPE_LABELS: Record<string, string> = {
  short: "Post",
  article: "Article",
  service: "Service",
};

export default async function ComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, email, handle, display_name, profile_image, city, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator) {
    return <NoCreatorState />;
  }

  const c = creator as CreatorRow;

  if (c.status === "pending") {
    return <PendingState />;
  }
  if (c.status === "suspended") {
    return <SuspendedState />;
  }

  const [postsRes, statsRes] = await Promise.all([
    supabase
      .from("creator_posts")
      .select("id, slug, type, title, status, view_count, published_at, created_at")
      .eq("creator_id", c.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("creator_posts")
      .select("status, view_count")
      .eq("creator_id", c.id),
  ]);

  const recentPosts = (postsRes.data ?? []) as PostRow[];
  const allPosts = statsRes.data ?? [];
  const publishedCount = allPosts.filter((p) => p.status === "published").length;
  const totalViews = allPosts.reduce((sum, p) => sum + (p.view_count ?? 0), 0);

  const initials = c.display_name
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-8 max-w-[1320px] mx-auto w-full">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-noir bg-creme-fonce overflow-hidden flex items-center justify-center shrink-0">
              {c.profile_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.profile_image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="display-2 text-noir/30">{initials}</span>
              )}
            </div>
            <div>
              <p className="eyebrow text-noir-doux mb-1">Mon compte</p>
              <h1 className="display-2">{c.display_name}</h1>
              <p className="mono-meta text-noir-doux mt-1">
                @{c.handle} {c.city ? `· ${c.city}` : ""}
              </p>
            </div>
          </div>
          <Link
            href={`/createurs/${c.handle}`}
            target="_blank"
            className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
          >
            Voir ma page publique ↗
          </Link>
        </div>
      </section>

      <section className="px-6 lg:px-14 py-6 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="eyebrow text-noir-doux">Publiés</p>
            <p className="display-1 leading-none mt-2">{publishedCount}</p>
            <p className="small text-noir-doux mt-1">posts, articles, services</p>
          </Card>
          <Card className="p-5">
            <p className="eyebrow text-noir-doux">Total vues</p>
            <p className="display-1 leading-none mt-2">{totalViews}</p>
            <p className="small text-noir-doux mt-1">depuis le début</p>
          </Card>
          <Card className="p-5">
            <p className="eyebrow text-noir-doux">Brouillons</p>
            <p className="display-1 leading-none mt-2">
              {allPosts.filter((p) => p.status === "draft").length}
            </p>
            <p className="small text-noir-doux mt-1">en cours d&apos;écriture</p>
          </Card>
        </div>
      </section>

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-3">Composer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard
            href="/compte/composer?type=short"
            title="Post court"
            description="Tweet-like, jusqu'à 4 images."
          />
          <ActionCard
            href="/compte/composer?type=article"
            title="Article"
            description="Long format, éditeur riche."
          />
          <ActionCard
            href="/compte/composer?type=service"
            title="Service"
            description="Vitrine produit avec CTA."
          />
          <ActionCard
            href="/compte/profil"
            title="Mon profil"
            description="Photo, bio, liens, catégories."
          />
        </div>
      </section>

      <section className="border-t border-noir px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="heading-1">Mes derniers contenus</h2>
          <Link
            href="/compte/contenus"
            className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
          >
            Tout voir →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-3 mb-2">Pas encore de contenu.</p>
            <p className="small text-noir-doux mb-4 max-w-md mx-auto">
              Lance-toi avec un post court — c&apos;est le format le plus
              rapide pour démarrer.
            </p>
            <Link
              href="/compte/composer?type=short"
              className="mono-meta text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              Écrire mon premier post →
            </Link>
          </Card>
        ) : (
          <div className="border border-noir bg-creme-clair rounded-lg overflow-hidden">
            {recentPosts.map((p) => (
              <Link
                key={p.id}
                href={`/compte/composer/${p.id}`}
                className="block px-5 py-3.5 border-b border-noir/15 last:border-b-0 hover:bg-creme-fonce/40 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Tag>{TYPE_LABELS[p.type]}</Tag>
                    <span className="font-body font-medium text-[15px] truncate">
                      {p.title ?? <em className="text-noir-doux">Sans titre</em>}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 mono-meta text-noir-doux">
                    <span>↗ {p.view_count}</span>
                    <span>{timeAgo(p.created_at)}</span>
                    {p.status === "published" ? (
                      <span className="text-accent-deep">● Publié</span>
                    ) : p.status === "archived" ? (
                      <span>● Archivé</span>
                    ) : p.status === "flagged" ? (
                      <span className="text-rouge-brique">⚠ Signalé</span>
                    ) : (
                      <span>○ Brouillon</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-noir px-6 lg:px-14 py-10 max-w-[1320px] mx-auto w-full flex flex-wrap gap-4 mono-meta text-noir-doux">
        <Link
          href={`/createurs/${c.handle}`}
          target="_blank"
          className="hover:text-accent-deep transition-colors"
        >
          ↗ Voir ma page publique
        </Link>
        <Link
          href="/compte/contenus"
          className="hover:text-accent-deep transition-colors"
        >
          → Tous mes contenus
        </Link>
        <Link
          href="/compte/parametres"
          className="hover:text-accent-deep transition-colors"
        >
          ⚙ Paramètres
        </Link>
      </section>
    </>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="block">
      <Card hoverable className="p-5 h-full">
        <p className="heading-3">{title}</p>
        <p className="small text-noir-doux mt-2 leading-relaxed">
          {description}
        </p>
        <p className="mono-meta text-accent-deep mt-4">→ Démarrer</p>
      </Card>
    </Link>
  );
}

function NoCreatorState() {
  return (
    <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
      <p className="eyebrow text-noir-doux">Pas de profil créateur</p>
      <h1 className="display-2">
        Cet email n&apos;a pas de profil créateur lié.
      </h1>
      <p className="body leading-relaxed">
        Tu es peut-être membre de l&apos;équipe sans être créateur, ou ta
        candidature est en attente. Si tu penses que c&apos;est une erreur,
        écris à{" "}
        <a
          href="mailto:hello@creon.ch"
          className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
        >
          hello@creon.ch
        </a>
        .
      </p>
      <Link
        href="/proposer-mon-profil"
        className="mono-meta text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 inline-block"
      >
        Proposer mon profil →
      </Link>
    </section>
  );
}

function PendingState() {
  return (
    <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
      <p className="eyebrow text-noir-doux">Candidature en attente</p>
      <h1 className="display-2">
        Ta candidature est en cours de relecture.
      </h1>
      <p className="body leading-relaxed">
        On lit chaque candidature manuellement. Dès qu&apos;elle est
        approuvée, tu reçois un email et tu auras accès à cet espace pour
        finaliser ton profil et publier tes premiers contenus.
      </p>
    </section>
  );
}

function SuspendedState() {
  return (
    <section className="px-6 lg:px-14 py-20 max-w-2xl mx-auto w-full space-y-6">
      <p className="eyebrow text-noir-doux">Compte suspendu</p>
      <h1 className="display-2">Ton profil est actuellement suspendu.</h1>
      <p className="body leading-relaxed">
        Pour réactiver ton compte ou comprendre pourquoi il est suspendu,
        contacte{" "}
        <a
          href="mailto:hello@creon.ch"
          className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
        >
          hello@creon.ch
        </a>
        .
      </p>
    </section>
  );
}
