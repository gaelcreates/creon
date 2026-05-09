import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

async function getStats() {
  const supabase = await createClient();
  const [creators, pending, subscribers, events, articles, posts, flags] =
    await Promise.all([
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
      supabase
        .from("creator_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("post_flags")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);
  return {
    creators: creators.count ?? 0,
    pending: pending.count ?? 0,
    subscribers: subscribers.count ?? 0,
    events: events.count ?? 0,
    articles: articles.count ?? 0,
    posts: posts.count ?? 0,
    flags: flags.count ?? 0,
  };
}

async function getRecent() {
  const supabase = await createClient();
  const [pendingCreators, recentPosts, recentEvents, recentSubs] =
    await Promise.all([
      supabase
        .from("creators")
        .select("id, display_name, email, city, categories, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("creator_posts")
        .select(
          "id, slug, type, title, status, view_count, created_at, creator:creators(handle, display_name)",
        )
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("events")
        .select("id, title, city, status, date_start, created_at")
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
    recentPosts: recentPosts.data ?? [],
    recentEvents: recentEvents.data ?? [],
    recentSubs: recentSubs.data ?? [],
  };
}

function StatCard({
  label,
  value,
  href,
  highlight,
  hint,
}: {
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
  hint?: string;
}) {
  const inner = (
    <Card
      className={cn(
        "p-5 h-full",
        href &&
          "transition-all duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)] cursor-pointer",
        highlight && "border-accent bg-accent-soft",
      )}
    >
      <p className="eyebrow text-noir-doux">{label}</p>
      <p className="display-2 mt-2 leading-none">{value}</p>
      {hint && <p className="mono-meta text-noir-doux mt-1">{hint}</p>}
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
  short: "Post",
  article: "Article",
  service: "Service",
};

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecent()]);

  return (
    <div className="max-w-7xl space-y-10">
      <div>
        <p className="eyebrow text-noir-doux">Back-office</p>
        <h1 className="display-2 mt-2">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Candidatures"
          value={stats.pending}
          href="/admin/creators"
          highlight={stats.pending > 0}
          hint="à traiter"
        />
        <StatCard
          label="Signalements"
          value={stats.flags}
          href="/admin/moderation"
          highlight={stats.flags > 0}
          hint="à modérer"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        <StatCard
          label="Posts créateurs"
          value={stats.posts}
          href="/feed"
          hint="publiés"
        />
        <StatCard
          label="Events publiés"
          value={stats.events}
          href="/admin/events?tab=published"
        />
        <StatCard
          label="Articles éditoriaux"
          value={stats.articles}
          href="/admin/articles?tab=published"
        />
      </div>

      <div className="border-t border-noir pt-8">
        <p className="eyebrow text-noir-doux mb-6">Activité récente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSection
          title="Candidatures"
          link="/admin/creators"
          empty="Aucune candidature en attente."
          emptyCta=""
          emptyCtaHref=""
        >
          {recent.pendingCreators.map((c) => (
            <RecentItem
              key={c.id}
              href="/admin/creators"
              title={c.display_name}
              meta={`${c.email}${c.city ? ` · ${c.city}` : ""}`}
              timestamp={timeAgo(c.created_at)}
            />
          ))}
        </RecentSection>

        <RecentSection
          title="Posts créateurs"
          link="/feed"
          empty="Pas encore de post publié."
          emptyCta="Voir le feed"
          emptyCtaHref="/feed"
        >
          {recent.recentPosts.map((p: any) => (
            <RecentItem
              key={p.id}
              href={`/admin/moderation?post=${p.id}`}
              title={p.title ?? <em className="text-noir-doux">Sans titre</em>}
              meta={`${TYPE_LABELS[p.type]} · ${p.creator?.display_name ?? "?"}`}
              timestamp={timeAgo(p.created_at)}
              status={p.status}
            />
          ))}
        </RecentSection>

        <RecentSection
          title="Derniers events créés"
          link="/admin/events"
          empty="Pas encore d'event."
          emptyCta="Créer le premier"
          emptyCtaHref="/admin/events/new"
        >
          {recent.recentEvents.map((e) => (
            <RecentItem
              key={e.id}
              href={`/admin/events/${e.id}`}
              title={e.title}
              meta={`${e.city} · ${new Date(e.date_start).toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit" })}`}
              timestamp={timeAgo(e.created_at)}
              status={e.status}
            />
          ))}
        </RecentSection>

        <RecentSection
          title="Derniers abonnés newsletter"
          link="/admin/newsletter"
          empty="Pas encore d'abonné."
          emptyCta=""
          emptyCtaHref=""
        >
          {recent.recentSubs.map((s, i) => (
            <RecentItem
              key={i}
              title={s.email}
              meta={s.source ?? ""}
              timestamp={timeAgo(s.subscribed_at)}
            />
          ))}
        </RecentSection>
      </div>
    </div>
  );
}

function RecentSection({
  title,
  link,
  empty,
  emptyCta,
  emptyCtaHref,
  children,
}: {
  title: string;
  link: string;
  empty: string;
  emptyCta: string;
  emptyCtaHref: string;
  children: React.ReactNode;
}) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const hasChildren = childrenArray.filter(Boolean).length > 0;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="heading-2">{title}</h2>
        {hasChildren && (
          <Link
            href={link}
            className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
          >
            Voir tout →
          </Link>
        )}
      </div>
      {!hasChildren ? (
        <p className="mono-meta text-noir-doux py-4">
          {empty}
          {emptyCta && emptyCtaHref && (
            <>
              {" "}
              <Link
                href={emptyCtaHref}
                className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
              >
                {emptyCta} →
              </Link>
            </>
          )}
        </p>
      ) : (
        <div className="border border-noir bg-creme-clair rounded-lg overflow-hidden divide-y divide-noir/15">
          {children}
        </div>
      )}
    </section>
  );
}

function RecentItem({
  href,
  title,
  meta,
  timestamp,
  status,
}: {
  href?: string;
  title: React.ReactNode;
  meta: string;
  timestamp: string;
  status?: string;
}) {
  const inner = (
    <div className="px-4 py-3 hover:bg-creme-fonce/40 transition-colors">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-body text-[14px] font-medium truncate">
          {title}
        </span>
        <span className="mono-meta text-noir-doux shrink-0">{timestamp}</span>
      </div>
      <p className="mono-meta text-noir-doux mt-0.5 flex items-center gap-2">
        {status === "published" ? (
          <span className="text-accent-deep">●</span>
        ) : status === "draft" ? (
          <span>○</span>
        ) : status === "archived" ? (
          <span>●</span>
        ) : status === "flagged" ? (
          <span className="text-rouge-brique">⚠</span>
        ) : null}
        <span>{meta}</span>
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
