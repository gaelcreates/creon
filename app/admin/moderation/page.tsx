import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type Tab = "pending" | "reviewed" | "all";

type FlagRow = {
  id: string;
  post_id: string;
  reporter_email: string | null;
  reason: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  created_at: string;
  post: {
    id: string;
    slug: string;
    type: string;
    title: string | null;
    flag_count: number;
    status: string;
    creator: { handle: string; display_name: string };
  } | null;
};

export const metadata = {
  title: "Modération — CREON Admin",
};

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab: Tab =
    params.tab === "reviewed" || params.tab === "all" ? params.tab : "pending";

  const supabase = await createClient();

  let query = supabase
    .from("post_flags")
    .select(
      "id, post_id, reporter_email, reason, status, created_at, post:creator_posts(id, slug, type, title, flag_count, status, creator:creators(handle, display_name))",
    )
    .order("created_at", { ascending: false });
  if (tab === "pending") query = query.eq("status", "pending");
  if (tab === "reviewed") query = query.in("status", ["reviewed", "action_taken", "dismissed"]);

  const [pendingCount, totalCount, listRes] = await Promise.all([
    supabase
      .from("post_flags")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("post_flags").select("id", { count: "exact", head: true }),
    query,
  ]);

  const flags = (listRes.data ?? []) as unknown as FlagRow[];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <p className="eyebrow text-noir-doux">Back-office</p>
        <h1 className="display-2 mt-2">Modération</h1>
      </div>

      <div className="flex gap-3 border-b border-noir flex-wrap">
        <TabLink
          active={tab === "pending"}
          href="/admin/moderation?tab=pending"
          label="En attente"
          count={pendingCount.count ?? 0}
        />
        <TabLink
          active={tab === "reviewed"}
          href="/admin/moderation?tab=reviewed"
          label="Traités"
          count={(totalCount.count ?? 0) - (pendingCount.count ?? 0)}
        />
        <TabLink
          active={tab === "all"}
          href="/admin/moderation?tab=all"
          label="Tout"
          count={totalCount.count ?? 0}
        />
      </div>

      {flags.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-noir/30">
          <p className="heading-2 mb-3">Aucun signalement.</p>
          <p className="small text-noir-doux">
            {tab === "pending"
              ? "Tout est sous contrôle pour l'instant."
              : "Pas encore de signalement traité."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {flags.map((flag) => (
            <Card key={flag.id} className="p-5 space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Tag variant={flag.status === "pending" ? "accent" : "default"}>
                    {flag.status === "pending"
                      ? "En attente"
                      : flag.status === "action_taken"
                        ? "Action prise"
                        : flag.status === "dismissed"
                          ? "Ignoré"
                          : "Traité"}
                  </Tag>
                  {flag.post && flag.post.flag_count > 1 && (
                    <span className="mono-meta text-rouge-brique">
                      {flag.post.flag_count} signalements
                    </span>
                  )}
                </div>
                <span className="mono-meta text-noir-doux">
                  {new Date(flag.created_at).toLocaleDateString("fr-CH")}
                </span>
              </div>

              {flag.post ? (
                <Link
                  href={`/createurs/${flag.post.creator.handle}/${flag.post.slug}`}
                  target="_blank"
                  className="block hover:text-accent-deep transition-colors"
                >
                  <p className="heading-3 leading-tight">
                    {flag.post.title ?? (
                      <em className="text-noir-doux">Sans titre</em>
                    )}
                  </p>
                  <p className="mono-meta text-noir-doux mt-1">
                    {flag.post.type} · par {flag.post.creator.display_name}
                  </p>
                </Link>
              ) : (
                <p className="small text-noir-doux italic">
                  Post supprimé
                </p>
              )}

              <div className="border-t border-noir/15 pt-3 space-y-2">
                <p className="eyebrow text-noir-doux">Raison</p>
                <p className="small">{flag.reason}</p>
                {flag.reporter_email && (
                  <p className="mono-meta text-noir-doux">
                    par {flag.reporter_email}
                  </p>
                )}
              </div>

              <p className="mono-meta text-noir-doux pt-2 border-t border-noir/15">
                Actions (Ignorer / Avertir / Masquer / Bannir) — à câbler
                Sprint suivant
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-3 font-body text-[14px] font-medium border-b-2 -mb-[1px] transition-colors",
        active
          ? "border-accent text-noir"
          : "border-transparent text-noir-doux hover:text-noir",
      )}
    >
      {label}
      <span className="mono-meta text-noir-doux ml-1.5">·&nbsp;{count}</span>
    </Link>
  );
}
