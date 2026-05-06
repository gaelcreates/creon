import Link from "next/link";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/createurs", label: "Créateurs" },
  { href: "/articles", label: "Articles" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/a-propos", label: "À propos" },
];

export function Footer() {
  return (
    <footer className="bg-noir text-creme mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display text-4xl mb-5 leading-none">CREON</h3>
            <p className="font-body text-sm leading-relaxed text-creme/80">
              Le média des créatifs suisses. Events, créateurs, articles —
              curés à la main pour la culture vivante d&apos;ici.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl mb-4 leading-none">Naviguer</h4>
            <ul className="space-y-2.5 font-body text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl mb-4 leading-none">Suivre</h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <a
                  href="https://instagram.com/creoncrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <Link
                  href="/proposer-mon-profil"
                  className="hover:text-accent transition-colors"
                >
                  Proposer mon profil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-creme/20 pt-6 flex flex-col md:flex-row justify-between gap-4 font-body text-xs text-creme/60">
          <span>© 2026 CREON. Tout droit éditorial préservé.</span>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="hover:text-creme transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="hover:text-creme transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
