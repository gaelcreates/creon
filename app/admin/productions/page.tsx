import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type Tab = "references" | "inquiries";

type ReferenceRow = {
  id: string;
  slug: string;
  client_name: string;
  project_title: string;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published";
  order_index: number;
  created_at: string;
};

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string;
  budget_range: string | null;
  message: string;
  status: "new" | "contacted" | "won" | "lost";
  created_at: string;
};

export const metadata = {
  title: "Productions — CREON Admin",
};

export default async function AdminProductionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab: Tab = params.tab === "inquiries" ? "inquiries" : "references";

  const supabase = await createClient();

  const [refsCount, inquiriesCount, newInquiriesCount, listRes] =
    await Promise.all([
      supabase
        .from("productions_references")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("production_inquiries")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("production_inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      tab === "references"
        ? supabase
            .from("productions_references")
            .select(
              "id, slug, client_name, project_title, cover_image, tags, status, order_index, created_at",
            )
            .order("order_index", { ascending: true })
        : supabase
            .from("production_inquiries")
            .select(
              "id, name, email, phone, company, project_type, budget_range, message, status, created_at",
            )
            .order("created_at", { ascending: false }),
    ]);

  const items = listRes.data ?? [];

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-noir-doux">Back-office</p>
          <h1 className="display-2 mt-2">Productions</h1>
        </div>
        {tab === "references" && (
          <Link
            href="/admin/productions/new"
            className="px-4 py-2 border border-noir bg-accent text-noir font-body text-[13px] font-medium rounded-md hover:bg-accent-deep transition-colors"
          >
            + Nouvelle référence
          </Link>
        )}
      </div>

      <div className="flex gap-3 border-b border-noir">
        <TabLink
          active={tab === "references"}
          href="/admin/productions"
          label="Références"
          count={refsCount.count ?? 0}
        />
        <TabLink
          active={tab === "inquiries"}
          href="/admin/productions?tab=inquiries"
          label="Devis reçus"
          count={inquiriesCount.count ?? 0}
          urgent={(newInquiriesCount.count ?? 0) > 0}
          urgentBadge={newInquiriesCount.count ?? 0}
        />
      </div>

      {items.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-noir/30">
          <p className="heading-2 mb-3">
            {tab === "references"
              ? "Aucune référence."
              : "Aucun devis reçu."}
          </p>
          <p className="small text-noir-doux mb-4">
            {tab === "references"
              ? "Ajoute des projets pour les afficher sur la page /productions publique."
              : "Les devis arrivent quand un visiteur remplit le formulaire sur /productions."}
          </p>
          {tab === "references" && (
            <Link
              href="/admin/productions/new"
              className="mono-meta text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              Ajouter la première →
            </Link>
          )}
        </Card>
      ) : tab === "references" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(items as ReferenceRow[]).map((ref) => (
            <Card key={ref.id} hoverable className="overflow-hidden">
              <Link href={`/admin/productions/${ref.id}`} className="block">
                <div className="aspect-[16/10] bg-creme-fonce border-b border-noir overflow-hidden">
                  {ref.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ref.cover_image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    {ref.status === "published" ? (
                      <Tag variant="accent">Publié</Tag>
                    ) : (
                      <Tag>Brouillon</Tag>
                    )}
                    <span className="mono-meta text-noir-doux">
                      #{ref.order_index}
                    </span>
                  </div>
                  <h3 className="heading-3 leading-tight">
                    {ref.project_title}
                  </h3>
                  <p className="small text-noir-doux">{ref.client_name}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-noir bg-creme-clair rounded-lg overflow-hidden divide-y divide-noir/15">
          {(items as InquiryRow[]).map((inq) => (
            <div key={inq.id} className="p-5 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="heading-3">{inq.name}</p>
                  <Tag
                    variant={
                      inq.status === "new"
                        ? "accent"
                        : inq.status === "won"
                          ? "soft"
                          : "default"
                    }
                  >
                    {inq.status === "new"
                      ? "Nouveau"
                      : inq.status === "contacted"
                        ? "Contacté"
                        : inq.status === "won"
                          ? "Gagné"
                          : "Perdu"}
                  </Tag>
                </div>
                <span className="mono-meta text-noir-doux">
                  {new Date(inq.created_at).toLocaleDateString("fr-CH")}
                </span>
              </div>
              <p className="mono-meta">
                {inq.email}
                {inq.phone ? ` · ${inq.phone}` : ""}
                {inq.company ? ` · ${inq.company}` : ""}
              </p>
              <p className="small text-noir-doux">
                {inq.project_type}
                {inq.budget_range ? ` · ${inq.budget_range}` : ""}
              </p>
              <p className="body mt-2 text-noir-doux leading-relaxed">
                {inq.message}
              </p>
            </div>
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
  urgent,
  urgentBadge,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
  urgent?: boolean;
  urgentBadge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-3 font-body text-[14px] font-medium border-b-2 -mb-[1px] transition-colors flex items-center gap-2",
        active
          ? "border-accent text-noir"
          : "border-transparent text-noir-doux hover:text-noir",
      )}
    >
      {label}
      <span className="mono-meta text-noir-doux">·&nbsp;{count}</span>
      {urgent && urgentBadge && urgentBadge > 0 && (
        <span className="mono-meta text-accent-deep">+{urgentBadge}</span>
      )}
    </Link>
  );
}
