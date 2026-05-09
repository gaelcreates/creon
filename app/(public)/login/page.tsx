import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Connexion — CREON",
};

async function loginAction(formData: FormData) {
  "use server";
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) {
    redirect("/login?error=Email%20requis");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/login/sent?email=${encodeURIComponent(email)}`);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="flex-1 flex items-center justify-center px-6 py-16 lg:py-24">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Espace privé</p>
          <h1 className="display-2">
            <span className="hl">Connexion</span>
          </h1>
          <p className="body text-noir-doux leading-relaxed">
            Tape ton email, on t&apos;envoie un lien magique. Pas de mot de
            passe à retenir.
          </p>
        </div>

        {params.error && (
          <div className="border border-rouge-brique bg-rouge-brique/10 px-4 py-3 rounded-md font-body text-[14px] text-rouge-brique">
            {params.error}
          </div>
        )}

        <form action={loginAction} className="space-y-3">
          <Input
            type="email"
            name="email"
            placeholder="ton@email.ch"
            required
            autoFocus
          />
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Recevoir mon lien →
          </Button>
        </form>

        <p className="small text-noir-doux">
          Pas encore inscrit ?{" "}
          <Link
            href="/proposer-mon-profil"
            className="text-noir underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent-deep transition-colors"
          >
            Propose ton profil →
          </Link>
        </p>
      </div>
    </section>
  );
}
