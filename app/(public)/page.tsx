import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { CreatorCard } from "@/components/CreatorCard";
import { ArticleCard } from "@/components/ArticleCard";
import { Tag } from "@/components/ui/Tag";

const events = [
  {
    title: "Antigel Off — Plainpalais",
    href: "/events/antigel-off-plainpalais",
    cover: "/assets/riso-event-1.svg",
    category: "Musique",
    date: "VEN 09.05",
    meta: "Genève · 21h · entrée libre",
    price: "Gratuit",
    likes: 24,
  },
  {
    title: "Vernissage : Lac, après l’orage.",
    href: "/events/vernissage-lac-apres-orage",
    cover: "/assets/riso-event-3.svg",
    category: "Art",
    date: "SAM 10.05",
    meta: "Mex · galerie Forme · 18h",
    price: "CHF 5",
    likes: 12,
  },
  {
    title: "Friperie de la Réformée — printemps",
    href: "/events/friperie-reformee-printemps",
    cover: "/assets/riso-event-2.svg",
    category: "Mode",
    date: "DIM 11.05",
    meta: "Lausanne · Pl. Saint-François · 11h–17h",
    price: "Gratuit",
    likes: 47,
  },
];

const creators = [
  {
    display_name: "Nora Kessler",
    handle: "nora-kessler",
    display_handle: "@nora.k",
    category: "Mode",
    city: "Lausanne",
    portrait: "/assets/riso-portrait-1.svg",
  },
  {
    display_name: "Sami Béhar",
    handle: "sami-behar",
    display_handle: "@samitype",
    category: "Design",
    city: "Genève",
    portrait: "/assets/riso-portrait-2.svg",
  },
  {
    display_name: "Mira Sallinen",
    handle: "mira-sallinen",
    display_handle: "@mira.s",
    category: "Photo",
    city: "Vevey",
    portrait: "/assets/riso-portrait-3.svg",
  },
  {
    display_name: "Léo Brossard",
    handle: "leo-brossard",
    display_handle: "@leob.studio",
    category: "Art",
    city: "Fribourg",
    portrait: "/assets/riso-portrait-1.svg",
  },
  {
    display_name: "Anaïs Coulon",
    handle: "anais-coulon",
    display_handle: "@anaisc",
    category: "Musique",
    city: "Neuchâtel",
    portrait: "/assets/riso-portrait-2.svg",
  },
];

const articlesSmall = [
  {
    title: "Sami Béhar, le typographe qui dort à l’atelier.",
    slug: "sami-behar-typographe-atelier",
    cover: "/assets/riso-article-1.svg",
    type: "Portrait",
    reading_time: 6,
    date: "28.04.26",
  },
  {
    title: "Comment Genève est devenue la capitale secrète de la mode upcyclée.",
    slug: "geneve-capitale-mode-upcyclee",
    cover: "/assets/riso-article-2.svg",
    type: "Carte blanche",
    reading_time: 4,
    date: "26.04.26",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 lg:px-14 pt-10 pb-16 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">Édito · 06.05.26</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-12 items-end">
          <h1 className="font-display text-[clamp(64px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
            La scène<br />
            <span className="hl-block">romande</span><br />
            n&apos;attend<br />personne.
          </h1>
          <div>
            <div className="aspect-[5/4] overflow-hidden border-[2.5px] border-noir shadow-[6px_6px_0_var(--color-noir)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/riso-hero.svg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-5 text-[17px] leading-relaxed max-w-[440px]">
              Mode, musique, design, photo, art. Six villes, vingt-trois
              lieux, quatre-vingts créateurs. Tu rates rien.{" "}
              <Link
                href="/a-propos"
                className="text-accent border-b-2 border-accent hover:text-accent-deep"
              >
                Lis le manifeste →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      {/* 01 — EVENTS */}
      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-7">
          <div>
            <p className="eyebrow text-noir-doux">01 — À l&apos;affiche</p>
            <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
              Cette semaine
            </h2>
          </div>
          <Link
            href="/events"
            className={`hidden sm:inline-flex ${buttonVariants({ variant: "secondary", size: "sm" })}`}
          >
            Tous les events →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-7 pb-5 border-b-[1.5px] border-noir/30 items-baseline">
          <Tag variant="accent">Tout · 23</Tag>
          <Tag>Musique · 9</Tag>
          <Tag>Art · 5</Tag>
          <Tag>Mode · 3</Tag>
          <Tag>Design · 4</Tag>
          <Tag>Photo · 2</Tag>
          <span className="ml-auto mono-meta text-noir-doux">
            Trier : par date ↓
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {events.map((e) => (
            <EventCard key={e.href} {...e} />
          ))}
        </div>
      </section>

      {/* 02 — CREATORS (alt bg + grain) */}
      <section className="bg-creme-fonce border-y-[2.5px] border-noir grain-bg">
        <div className="relative z-[2] px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-baseline justify-between gap-6 mb-9">
            <div>
              <p className="eyebrow text-noir-doux">02 — Sous le radar</p>
              <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
                Les créateurs<br className="hidden lg:block" /> du moment.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-noir-doux">
              Cinq portraits par semaine. Mode, art, musique, design, photo.
              Choisis par la rédaction, pas par un algo.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {creators.map((c, i) => (
              <CreatorCard key={c.handle} {...c} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTE (noir + grain) */}
      <section className="bg-noir text-creme grain-bg grain-on-dark">
        <div className="relative z-[2] px-6 lg:px-14 py-20 lg:py-24 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_200px] gap-8 lg:gap-10 items-start">
            <p className="eyebrow text-accent">Manifeste</p>
            <div>
              <p className="font-display text-[32px] sm:text-5xl lg:text-[56px] leading-[1.05] m-0">
                On fait un magazine pour celles et ceux qui pensent encore qu&apos;une{" "}
                <span className="bg-accent text-noir px-1">
                  affiche risographe
                </span>{" "}
                dans une cave de Renens vaut mieux qu&apos;un post sponso.
              </p>
              <div className="flex flex-wrap items-center gap-5 mt-8">
                <Link
                  href="/a-propos"
                  className={buttonVariants({ variant: "primary" })}
                >
                  Lire le manifeste complet →
                </Link>
                <span className="mono-meta text-paper-edge">
                  Écrit en 2024 · révisé chaque année
                </span>
              </div>
            </div>
            <p className="mono-meta text-paper-edge text-[11px] leading-relaxed border-l-2 border-accent pl-3.5">
              « Indépendant ne veut pas dire amateur.
              <br />
              Imparfait ne veut pas dire bâclé.
              <br />
              Suisse ne veut pas dire timide. »
            </p>
          </div>
        </div>
      </section>

      {/* 03 — ARTICLES */}
      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="eyebrow text-noir-doux">03 — Lecture longue</p>
            <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
              Les dossiers.
            </h2>
          </div>
          <Link
            href="/articles"
            className={`hidden sm:inline-flex ${buttonVariants({ variant: "secondary", size: "sm" })}`}
          >
            Toutes les archives →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_1fr] gap-7 items-stretch">
          <Link
            href="/articles/riso-cave-lausanne"
            className="group flex flex-col border-[2.5px] border-noir bg-creme transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
          >
            <div className="aspect-[16/10] overflow-hidden border-b-[2.5px] border-noir">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/riso-article-2.svg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-6 pt-5 pb-6 flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <Tag variant="dark">Dossier</Tag>
                <span className="mono-meta">12 MIN · 02.05.26</span>
              </div>
              <h3 className="font-display text-[40px] sm:text-5xl leading-[0.94] m-0">
                Pourquoi la <span className="hl">riso</span> a colonisé les
                caves de Lausanne.
              </h3>
              <p className="text-base leading-relaxed max-w-[600px]">
                Six imprimeurs, quatre cantons, une seule machine japonaise des
                années 80. Enquête sur la résurgence d&apos;une technique
                d&apos;impression que tout le monde croyait morte.
              </p>
              <p className="mono-meta text-noir-doux">
                par Théo Vauthier — photographies de Mira S.
              </p>
            </div>
          </Link>

          {articlesSmall.map((a) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>
      </section>

      {/* 04 — NEWSLETTER (orange + grain) */}
      <section className="bg-accent border-y-[2.5px] border-noir grain-bg grain-on-orange">
        <div className="relative z-[2] px-6 lg:px-14 py-20 lg:py-24 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <p className="eyebrow mb-3.5">04 — Newsletter</p>
              <h2 className="font-display text-[48px] sm:text-7xl lg:text-[88px] leading-[0.88] m-0">
                La crème
                <br />
                du vendredi,
                <br />
                direct dans la boîte.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed max-w-[460px] mb-6">
                Une fois par semaine. Cinq events à pas rater, un créateur à
                découvrir, un dossier à lire. C&apos;est tout. Pas de spam,
                jamais.
              </p>
              <form className="flex border-[2.5px] border-noir bg-creme shadow-[6px_6px_0_var(--color-noir)]">
                <input
                  type="email"
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
              <p className="mono-meta mt-3.5 text-xs">
                4 200+ abonnés · taux d&apos;ouverture 64 % · désabonnement
                libre
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
