import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useAuth();

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
      <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
        <span className="gradient-brand grid size-9 place-items-center rounded-xl text-primary-foreground shadow-lg shadow-sky-500/30">
          A
        </span>
        <span className="font-bold">
          Aether<span className="text-brand">Homes</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
        <Link to="/search" search={{}} className="hover:text-ink">
          Buy
        </Link>
        <Link to="/search" search={{ type: "Condo" }} className="hover:text-ink">
          Condos
        </Link>
        <Link to="/saved" className="hover:text-ink">
          Saved
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-ink/80 hover:bg-white/60"
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/auth"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-ink/80 hover:bg-white/60"
          >
            Sign in
          </Link>
        )}
        <Link
          to="/saved"
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-ink/20 hover:bg-ink/90"
        >
          Saved homes
        </Link>
      </div>
    </header>
  );
}
