import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAuthState } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "404 — CREON",
};

export default async function NotFound() {
  const auth = await getAuthState();

  return (
    <>
      <Header creator={auth.creator} isAdmin={auth.isAdmin} />
      <main className="flex-1 flex flex-col">
        <section className="flex-1 px-6 lg:px-14 py-20 lg:py-28 max-w-[1320px] mx-auto w-full">
          <p className="eyebrow text-noir-doux mb-5">Erreur 404</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-end">
            <div>
              <h1 className="display-1">
                Cette page<br />
                n&apos;existe<br />
                <span className="hl">pas</span>.
              </h1>
              <p className="lead text-noir-doux mt-8 max-w-md">
                Elle a peut-être été déplacée, supprimée, ou n&apos;a jamais
                vraiment existé. Pas grave — la maison reste ouverte.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  Retour à l&apos;accueil →
                </Link>
                <Link
                  href="/feed"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  Voir le feed
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="aspect-square w-full max-w-sm border border-noir bg-creme-clair rounded-lg flex items-center justify-center">
                <span
                  className="text-[clamp(80px,14vw,180px)] font-display font-semibold text-noir/15 leading-none select-none"
                  aria-hidden
                >
                  404
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
