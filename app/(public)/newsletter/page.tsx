import { redirect } from "next/navigation";
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
      <section className="bg-accent border-b-[2.5px] border-noir grain-bg grain-on-orange">
        <div className="relative z-[2] px-6 lg:px-14 py-20 lg:py-24 max-w-[1320px] mx-auto w-full">
          <p className="eyebrow mb-4">Newsletter dominicale · ~600 mots</p>
          <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.88] m-0 tracking-tight">
            La crème<br />du vendredi,<br />direct dans ta boîte.
          </h1>

          <div className="mt-12 max-w-md">
            {subscribed ? (
              <div className="border-[2.5px] border-noir bg-creme p-6 shadow-[6px_6px_0_var(--color-noir)]">
                <p className="font-display text-3xl leading-tight">
                  Bienvenue à <span className="hl">bord</span>.
                </p>
                <p className="mt-3 text-base leading-relaxed">
                  T&apos;es inscrit·e. Premier email vendredi prochain.
                </p>
              </div>
            ) : (
              <>
                <form
                  action={subscribeAction}
                  className="flex border-[2.5px] border-noir bg-creme shadow-[6px_6px_0_var(--color-noir)]"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="ton@email.ch"
                    required
                    className="flex-1 border-0 bg-transparent px-5 py-5 font-body text-[17px] outline-none placeholder:text-noir/40"
                  />
                  <button
                    type="submit"
                    className="bg-noir text-creme border-0 border-l-[2.5px] border-noir px-6 font-body text-[13px] tracking-[0.14em] uppercase cursor-pointer hover:bg-noir-doux transition-colors"
                  >
                    Je m&apos;abonne →
                  </button>
                </form>
                {error && (
                  <p className="mono-meta mt-3 text-noir bg-creme inline-block px-2 py-1 border-2 border-noir">
                    {error}
                  </p>
                )}
                <p className="mono-meta mt-3.5 text-xs">
                  4 200+ abonnés · taux d&apos;ouverture 64 % · désabonnement
                  libre
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
          <p className="eyebrow text-noir-doux">01 — Le menu</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
            <div>
              <p className="font-display text-6xl leading-none">5</p>
              <p className="mono-meta uppercase mt-2 mb-2">Events</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                À pas rater dans les 7 prochains jours en Suisse romande.
              </p>
            </div>
            <div>
              <p className="font-display text-6xl leading-none">1</p>
              <p className="mono-meta uppercase mt-2 mb-2">Créateur</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                Profil court d&apos;un·e créateur·rice du moment.
              </p>
            </div>
            <div>
              <p className="font-display text-6xl leading-none">1</p>
              <p className="mono-meta uppercase mt-2 mb-2">Dossier</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                Article long de la semaine, à lire au lit ou dans le train.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
          <p className="eyebrow text-noir-doux">02 — Archives</p>
          <div>
            <h2 className="font-display text-[44px] sm:text-6xl mt-0 mb-10 leading-[0.92]">
              Derniers numéros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <article
                  key={issue.number}
                  className="border-2 border-noir bg-creme p-5 space-y-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-noir)]"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl leading-none">
                      {issue.number}
                    </span>
                    <span className="mono-meta">{issue.date}</span>
                  </div>
                  <h3 className="font-display text-xl leading-tight">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-noir-doux leading-relaxed">
                    {issue.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
