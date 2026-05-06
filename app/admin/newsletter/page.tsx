import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/cn";

type Subscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  source: string | null;
};

export const metadata = {
  title: "Newsletter — CREON Admin",
};

export default async function AdminNewsletterPage() {
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalRes, monthRes, listRes] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .gte("subscribed_at", startOfMonth.toISOString()),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .limit(200),
  ]);

  const subscribers = (listRes.data ?? []) as Subscriber[];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
            Back-office
          </p>
          <h1 className="font-display text-5xl mt-2 leading-none">
            Newsletter
          </h1>
        </div>
        <a
          href="/admin/newsletter/export"
          className="font-body text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-noir bg-accent text-noir shadow-[3px_3px_0_var(--color-noir)] hover:shadow-[5px_5px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          Exporter CSV ↓
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Stat label="Total abonnés" value={totalRes.count ?? 0} />
        <Stat label="Ce mois-ci" value={monthRes.count ?? 0} />
        <Stat
          label="Affichés"
          value={subscribers.length}
          hint="200 derniers"
        />
      </div>

      {subscribers.length === 0 ? (
        <p className="font-body text-noir-doux py-8">
          Aucun abonné pour l&apos;instant.
        </p>
      ) : (
        <div className="border-2 border-noir overflow-hidden">
          <table className="w-full font-body text-sm">
            <thead className="bg-creme-fonce border-b-2 border-noir">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Statut
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Source
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Inscrit le
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr
                  key={s.id}
                  className={cn(
                    "border-b border-noir/20 last:border-0",
                    i % 2 === 1 && "bg-creme-fonce/40",
                  )}
                >
                  <td className="px-4 py-3 mono-meta">{s.email}</td>
                  <td className="px-4 py-3 mono-meta">
                    {s.unsubscribed_at ? (
                      <span className="text-noir-doux">Désinscrit</span>
                    ) : s.confirmed ? (
                      <span className="text-accent-deep">Actif</span>
                    ) : (
                      <span>En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 mono-meta text-noir-doux">
                    {s.source ?? "—"}
                  </td>
                  <td className="px-4 py-3 mono-meta text-noir-doux">
                    {new Date(s.subscribed_at).toLocaleDateString("fr-CH", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="border-2 border-noir bg-creme p-5">
      <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
        {label}
      </p>
      <p className="font-display text-5xl mt-2 leading-none">{value}</p>
      {hint && <p className="mono-meta mt-1.5 text-noir-doux">{hint}</p>}
    </div>
  );
}
