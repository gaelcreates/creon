import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
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
      .from("articles")
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

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl space-y-8">
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
          href="/admin/creators"
        />
        <StatCard
          label="Abonnés newsletter"
          value={stats.subscribers}
          href="/admin/newsletter"
        />
        <StatCard
          label="Events publiés"
          value={stats.events}
          href="/admin/events"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <StatCard
          label="Articles publiés"
          value={stats.articles}
          href="/admin/articles"
        />
      </div>
    </div>
  );
}
