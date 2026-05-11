import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TitleIllustration } from "@/components/TitleIllustration";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Newsletter — CREON",
  description:
    "Reçois chaque vendredi les events, créateurs et articles à pas manquer en Suisse romande.",
};

const issues = [
  {
    number: "n°14",
    date: "10.05.26",
    title: "Vernissages, fanzines et un sound design qui dérange",
    excerpt:
      "Trois events à Lausanne ce week-end, un portrait de Marius Pittet, et la nouvelle vague d'éditrices indé.",
  },
  {
    number: "n°13",
    date: "03.05.26",
    title: "Tout ce qu'on a vu pendant le festival photo",
    excerpt:
      "Compte-rendu de Vevey, sélection de 8 séries qui valent le détour, et le carnet d'adresses des photographes locaux.",
  },
  {
    number: "n°12",
    date: "26.04.26",
    title: "Ouvrir un atelier : le guide pas-à-pas",
    excerpt:
      "Loyer, statut, sélection des membres : on a interviewé 4 ateliers qui marchent en Suisse romande.",
  },
];

async function subscribeAction(formData: FormData) {
  "use server";
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) {
    redirect(`/newsletter?error=${encodeURIComponent("Email invalide")}`);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .upsert(
      { email, source: "website", confirmed: true },
      { onConflict: "email", ignoreDuplicates: false },
    );

  if (error) {
    redirect(`/newsletter?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/newsletter?subscribed=1`);
}

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string; error?: string }>;
}) {
  const params = await searchParams;
  const subscribed = params.subscribed === "1";
  const error = params.error;

  return (
    <>
      <section className="relative px-6 lg:px-14 pt-28 pb-12 lg:pt-32 max-w-[1320px] mx-auto w-full overflow-hidden">
        <TitleIllustration variant="newsletter" />
        <p className="eyebrow text-noir-doux mb-5">
          Newsletter dominicale · ~600 mots
        </p>
        <h1 className="display-1 max-w-4xl">
          Reçois la <span className="hl">crème</span> du vendredi, direct
          dans ta boîte.
        </h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Cinq events à pas rater. Un créateur du moment. Un dossier à
          lire. Pas de spam, désabonnement en un clic.
        </p>

        <div className="mt-10 max-w-md">
          {subscribed ? (
            <Card className="p-6 border-accent">
              <p className="heading-3 mb-2">
                Bienvenue à <span className="hl">bord</span>.
              </p>
              <p className="body text-noir-doux">
                T&apos;es inscrit·e. Premier email vendredi prochain.
              </p>
            </Card>
          ) : (
            <>
              <form
                action={subscribeAction}
                className="flex border border-noir bg-creme-clair rounded-md overflow-hidden"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="ton@email.ch"
                  required
                  className="flex-1 px-4 py-3 border-0 bg-transparent font-body text-[15px] outline-none placeholder:text-noir-doux/50"
                />
                <button
                  type="submit"
                  className="bg-accent text-noir border-0 border-l border-noir px-5 font-body text-[14px] font-medium cursor-pointer hover:bg-accent-deep transition-colors"
                >
                  S&apos;abonner →
                </button>
              </form>
              {error && (
                <p className="mono-meta mt-3 text-rouge-brique">{error}</p>
              )}
              <p className="mono-meta text-noir-doux mt-3">
                4 200+ abonnés · taux d&apos;ouverture 64 %
              </p>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          <div>
            <span className="mono-meta text-noir-doux">01</span>
            <h2 className="heading-1 mt-1">Le menu</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
            {[
              { n: "5", l: "Events", d: "À pas rater dans les 7 prochains jours en Suisse romande." },
              { n: "1", l: "Créateur", d: "Profil court d'un·e créateur·rice du moment." },
              { n: "1", l: "Dossier", d: "Article long de la semaine, à lire au lit ou dans le train." },
            ].map((it) => (
              <div key={it.l}>
                <p className="display-1 leading-none">{it.n}</p>
                <p className="eyebrow text-noir-doux mt-2 mb-1">{it.l}</p>
                <p className="small text-noir-doux leading-relaxed">{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          <div>
            <span className="mono-meta text-noir-doux">02</span>
            <h2 className="heading-1 mt-1">Derniers numéros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {issues.map((issue) => (
              <Card key={issue.number} hoverable className="p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="heading-3">{issue.number}</span>
                  <span className="mono-meta text-noir-doux">{issue.date}</span>
                </div>
                <h3 className="body font-medium leading-tight">
                  {issue.title}
                </h3>
                <p className="small text-noir-doux leading-relaxed">
                  {issue.excerpt}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
