import Link from "next/link";

type FooterLink = { href: string; label: string; external?: boolean };
type FooterCol = { title: string; links: FooterLink[] };

const cols: FooterCol[] = [
  {
    title: "Plateforme",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/feed", label: "Feed" },
      { href: "/createurs", label: "Créateurs" },
      { href: "/events", label: "Events" },
      { href: "/articles", label: "Articles" },
      { href: "/services", label: "Services" },
      { href: "/productions", label: "Productions" },
    ],
  },
  {
    title: "Suivre",
    links: [
      {
        href: "https://instagram.com/creoncrew",
        label: "Instagram",
        external: true,
      },
      { href: "#", label: "TikTok", external: true },
      { href: "#", label: "Spotify", external: true },
      { href: "#", label: "Are.na", external: true },
    ],
  },
  {
    title: "Maison",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/proposer-mon-profil", label: "Proposer ton profil" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/mentions-legales", label: "Mentions" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-noir bg-creme mt-auto">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="font-display font-semibold text-2xl tracking-tight leading-none mb-4">
              CREON
            </div>
            <p className="text-[14px] leading-relaxed text-noir-doux max-w-xs">
              La plateforme suisse pour les créateurs. Annuaire, feed et events
              de la scène créative romande.
            </p>
            <p className="mono-meta text-noir-doux mt-5">
              Made in Switzerland · 2026
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-noir-doux mb-3">{col.title}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-noir hover:text-accent-deep transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-noir hover:text-accent-deep transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-noir/15 mt-12 pt-5 flex flex-col sm:flex-row justify-between gap-2 mono-meta text-noir-doux">
          <span>© CREON 2026 — Tous droits réservés.</span>
          <span>Lausanne · Genève</span>
        </div>
      </div>
    </footer>
  );
}
