import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

async function getStats() {
  const supabase = await createClient();
  const [creators, pending, subscribers, events, articles] = await Promise.all([
    supabase
      .from("creators")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("creators")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("editorial_articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
  ]);
  return {
    creators: creators.count ?? 0,
    pending: pending.count ?? 0,
    subscribers: subscribers.count ?? 0,
    events: events.count ?? 0,
    articles: articles.count ?? 0,
  };
}

async function getRecent() {
  const supabase = await createClient();
  const [pendingCreators, recentEvents, recentArticles, recentSubs] =
    await Promise.all([
      supabase
        .from("creators")
        .select("id, display_name, email, city, categories, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("events")
        .select("id, title, city, status, date_start, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("editorial_articles")
        .select("id, title, type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("newsletter_subscribers")
        .select("email, subscribed_at, source")
        .is("unsubscribed_at", null)
        .order("subscribed_at", { ascending: false })
        .limit(5),
    ]);
  return {
    pendingCreators: pendingCreators.data ?? [],
    recentEvents: recentEvents.data ?? [],
    recentArticles: recentArticles.data ?? [],
    recentSubs: recentSubs.data ?? [],
  };
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <Card
      className={cn(
        "p-6 h-full transition-all",
        href &&
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-noir)] cursor-pointer",
        highlight && "bg-accent",
      )}
    >
      <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
        {label}
      </p>
      <p className="font-display text-6xl mt-3 leading-none">{value}</p>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
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
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
};

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecent()]);

  return (
    <div className="max-w-7xl space-y-10">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
          Back-office
        </p>
        <h1 className="font-display text-5xl mt-2 leading-none">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Candidatures"
          value={stats.pending}
          href="/admin/creators"
          highlight={stats.pending > 0}
        />
        <StatCard
          label="Créateurs actifs"
          value={stats.creators}
          href="/admin/creators?tab=active"
        />
        <StatCard
          label="Abonnés newsletter"
          value={stats.subscribers}
          href="/admin/newsletter"
        />
        <StatCard
          label="Events publiés"
          value={stats.events}
          href="/admin/events?tab=published"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <StatCard
          label="Articles publiés"
          value={stats.articles}
          href="/admin/articles?tab=published"
        />
      </div>

      {/* Activité récente */}
      <div className="border-t-2 border-noir pt-8">
        <p className="eyebrow text-noir-doux">Activité récente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidatures */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-2xl leading-none">
              Candidatures
            </h2>
            {stats.pending > 0 && (
              <Link
                href="/admin/creators"
                className="mono-meta uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
              >
                Voir tout →
              </Link>
            )}
          </div>
          {recent.pendingCreators.length === 0 ? (
            <p className="mono-meta text-noir-doux py-4">
              Aucune candidature en attente.
            </p>
          ) : (
            <div className="border-2 border-noir bg-creme divide-y divide-noir/20">
              {recent.pendingCreators.map((c) => (
                <Link
                  key={c.id}
                  href="/admin/creators"
                  className="block p-3.5 hover:bg-creme-fonce/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg leading-tight">
                      {c.display_name}
                    </span>
                    <span className="mono-meta text-noir-doux shrink-0">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <p className="mono-meta text-noir-doux mt-0.5">
                    {c.email}
                    {c.city ? ` · ${c.city}` : ""}
                    {c.categories?.length ? ` · ${c.categories.join(", ")}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Events */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-2xl leading-none">
              Derniers events
            </h2>
            <Link
              href="/admin/events"
              className="mono-meta uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Voir tout →
            </Link>
          </div>
          {recent.recentEvents.length === 0 ? (
            <p className="mono-meta text-noir-doux py-4">
              Pas encore d&apos;event créé.{" "}
              <Link
                href="/admin/events/new"
                className="underline decoration-accent decoration-2 underline-offset-4"
              >
                Créer le premier →
              </Link>
            </p>
          ) : (
            <div className="border-2 border-noir bg-creme divide-y divide-noir/20">
              {recent.recentEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/admin/events/${e.id}`}
                  className="block p-3.5 hover:bg-creme-fonce/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg leading-tight flex-1">
                      {e.title}
                    </span>
                    <span className="mono-meta text-noir-doux shrink-0">
                      {timeAgo(e.created_at)}
                    </span>
                  </div>
                  <div className="mono-meta text-noir-doux mt-0.5 flex items-center gap-2">
                    {e.status === "published" ? (
                      <span className="text-accent-deep">● Publié</span>
                    ) : e.status === "archived" ? (
                      <span>● Archivé</span>
                    ) : (
                      <span>○ Brouillon</span>
                    )}
                    <span>·</span>
                    <span>{e.city}</span>
                    <span>·</span>
                    <span>
                      {new Date(e.date_start).toLocaleDateString("fr-CH", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Articles */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-2xl leading-none">
              Derniers articles
            </h2>
            <Link
              href="/admin/articles"
              className="mono-meta uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Voir tout →
            </Link>
          </div>
          {recent.recentArticles.length === 0 ? (
            <p className="mono-meta text-noir-doux py-4">
              Pas encore d&apos;article.{" "}
              <Link
                href="/admin/articles/new"
                className="underline decoration-accent decoration-2 underline-offset-4"
              >
                Écrire le premier →
              </Link>
            </p>
          ) : (
            <div className="border-2 border-noir bg-creme divide-y divide-noir/20">
              {recent.recentArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/articles/${a.id}`}
                  className="block p-3.5 hover:bg-creme-fonce/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg leading-tight flex-1">
                      {a.title}
                    </span>
                    <span className="mono-meta text-noir-doux shrink-0">
                      {timeAgo(a.created_at)}
                    </span>
                  </div>
                  <div className="mono-meta text-noir-doux mt-1 flex items-center gap-2">
                    <Tag className="text-[10px] px-1.5 py-0.5">
                      {TYPE_LABELS[a.type] ?? a.type}
                    </Tag>
                    <span>·</span>
                    {a.status === "published" ? (
                      <span className="text-accent-deep">Publié</span>
                    ) : a.status === "archived" ? (
                      <span>Archivé</span>
                    ) : (
                      <span>Brouillon</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Subscribers */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-2xl leading-none">
              Derniers abonnés newsletter
            </h2>
            <Link
              href="/admin/newsletter"
              className="mono-meta uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Voir tout →
            </Link>
          </div>
          {recent.recentSubs.length === 0 ? (
            <p className="mono-meta text-noir-doux py-4">
              Pas encore d&apos;abonné.
            </p>
          ) : (
            <div className="border-2 border-noir bg-creme divide-y divide-noir/20">
              {recent.recentSubs.map((s, i) => (
                <div key={i} className="p-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="mono-meta">{s.email}</span>
                    <span className="mono-meta text-noir-doux shrink-0">
                      {timeAgo(s.subscribed_at)}
                    </span>
                  </div>
                  {s.source && (
                    <div className="mono-meta text-noir-doux mt-0.5">
                      {s.source}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
