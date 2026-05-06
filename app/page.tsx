import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { CreatorCard } from "@/components/CreatorCard";
import { ArticleCard } from "@/components/ArticleCard";

const featuredEvents = [
  {
    title: "Vernissage — Atelier 13",
    city: "Lausanne",
    venue: "Atelier 13",
    date: "Sam 14 mars · 19h",
    categories: ["Art visuel", "Vernissage"],
    href: "/events/vernissage-atelier-13",
    coverTone: "creme-fonce" as const,
  },
  {
    title: "Soirée fanzine — Le Bourg",
    city: "Lausanne",
    venue: "Le Bourg",
    date: "Ven 20 mars · 21h",
    categories: ["Édition", "Soirée"],
    href: "/events/soiree-fanzine-le-bourg",
    coverTone: "noir" as const,
  },
  {
    title: "Design Market printemps",
    city: "Genève",
    venue: "Halle 6",
    date: "Sam-Dim 28-29 mars",
    categories: ["Design", "Artisanat"],
    href: "/events/design-market-printemps",
    coverTone: "accent" as const,
  },
];

const featuredCreators = [
  {
    display_name: "Léa Dornier",
    city: "Genève",
    short_bio: "Photographie documentaire et travail au moyen format.",
    categories: ["Photo"],
    handle: "lea-dornier",
  },
  {
    display_name: "Marius Pittet",
    city: "Lausanne",
    short_bio: "Sound design et musique pour film, théâtre, performance.",
    categories: ["Musique"],
    handle: "marius-pittet",
  },
  {
    display_name: "Camille Béguin",
    city: "Vevey",
    short_bio: "Illustration éditoriale, fanzine, sérigraphie en collectif.",
    categories: ["Art visuel", "Édition"],
    handle: "camille-beguin",
  },
  {
    display_name: "Salomé Vautier",
    city: "Bulle",
    short_bio: "Céramique fonctionnelle, terres locales, four à bois.",
    categories: ["Artisanat"],
    handle: "salome-vautier",
  },
];

const featuredArticles = [
  {
    title: "La nouvelle scène fanzine romande",
    excerpt:
      "On a passé une semaine entre Lausanne et Genève à rencontrer les éditrices indépendantes qui ressuscitent le print.",
    type: "coulisses" as const,
    reading_time: 7,
    author: "Gaël",
    date: "12 mars 2026",
    slug: "nouvelle-scene-fanzine-romande",
    coverTone: "creme-fonce" as const,
  },
  {
    title: "Marius Pittet, sculpteur de sons",
    excerpt:
      "Portrait du compositeur lausannois qui passe ses journées à enregistrer des objets pour les transformer en partitions.",
    type: "profil" as const,
    reading_time: 5,
    author: "Gaël",
    date: "5 mars 2026",
    slug: "marius-pittet-sculpteur-de-sons",
    coverTone: "noir" as const,
  },
  {
    title: "Comment ouvrir un atelier collectif en Suisse romande",
    excerpt:
      "Loyer, statut juridique, sélection des membres : retours d'expérience de 4 ateliers qui marchent.",
    type: "educatif" as const,
    reading_time: 9,
    author: "Gaël",
    date: "26 février 2026",
    slug: "ouvrir-atelier-collectif-suisse-romande",
    coverTone: "accent" as const,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-7xl mx-auto w-full">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux mb-6">
          Édition n°1 — Mars 2026
        </p>
        <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tight max-w-5xl">
          La culture créative suisse,{" "}
          <span className="bg-accent px-3 inline-block">curée</span> à la main.
        </h1>
        <p className="font-body text-lg sm:text-xl text-noir-doux mt-10 max-w-2xl leading-relaxed">
          Events, créateurs, articles. On parcourt la Suisse romande pour toi,
          tu reçois l&apos;essentiel directement.
        </p>
        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/newsletter"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            S&apos;abonner
          </Link>
          <Link
            href="/events"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Voir les events
          </Link>
        </div>
      </section>

      {/* Cette semaine */}
      <section className="border-t-2 border-noir px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
              Agenda
            </p>
            <h2 className="font-display text-4xl sm:text-6xl leading-none mt-3">
              Cette semaine
            </h2>
          </div>
          <Link
            href="/events"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent shrink-0"
          >
            Tous les events →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.href} {...event} />
          ))}
        </div>
      </section>

      {/* Créateurs */}
      <section className="border-t-2 border-noir px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
              Annuaire
            </p>
            <h2 className="font-display text-4xl sm:text-6xl leading-none mt-3">
              Nos créateurs en ce moment
            </h2>
          </div>
          <Link
            href="/createurs"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent shrink-0"
          >
            Tout l&apos;annuaire →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.handle} {...creator} />
          ))}
        </div>
      </section>

      {/* À lire */}
      <section className="border-t-2 border-noir px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
              Articles
            </p>
            <h2 className="font-display text-4xl sm:text-6xl leading-none mt-3">
              À lire
            </h2>
          </div>
          <Link
            href="/articles"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent shrink-0"
          >
            Tous les articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </section>

      {/* CTA Newsletter */}
      <section className="bg-noir text-creme border-t-2 border-noir px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-widest text-creme/60">
            Newsletter
          </p>
          <h2 className="font-display text-4xl sm:text-6xl leading-tight mt-4">
            Reçois{" "}
            <span className="bg-accent text-noir px-3 inline-block">
              l&apos;essentiel
            </span>{" "}
            chaque dimanche.
          </h2>
          <p className="font-body mt-6 text-creme/80 max-w-xl mx-auto leading-relaxed">
            Un email court, 600 mots. Pas de spam, pas de pub. Désabonnement
            en un clic.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 mt-10 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ton@email.ch"
              className="flex-1 px-4 py-3 border-2 border-creme bg-noir text-creme font-body placeholder:text-creme/50 focus:outline-none focus:bg-noir-doux transition-colors duration-150"
            />
            <button
              type="submit"
              className={buttonVariants({ variant: "primary" })}
            >
              S&apos;abonner
            </button>
          </form>
          <p className="font-body text-xs text-creme/50 mt-6">
            Ton email sert uniquement à la newsletter CREON.
          </p>
        </div>
      </section>
    </>
  );
}
