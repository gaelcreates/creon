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
          <p className="eyebrow text-noir-doux mb-4">Erreur 404</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-12 items-end">
            <div>
              <h1 className="font-display text-[clamp(72px,12vw,200px)] leading-[0.86] m-0 tracking-tight">
                Cette page<br />
                n&apos;existe<br />
                <span className="hl-block">pas</span>.
              </h1>
              <p className="font-body text-[17px] leading-relaxed mt-8 max-w-[460px]">
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
                  href="/events"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  Voir les events
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-square overflow-hidden border-[2.5px] border-noir bg-creme-fonce shadow-[6px_6px_0_var(--color-noir)] grain-bg flex items-center justify-center">
                <span
                  className="font-display text-[clamp(140px,18vw,280px)] text-noir/30 leading-none relative z-[2]"
                  aria-hidden
                >
                  ¯\_(ツ)_/¯
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
