import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/50 bg-white/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-8 sm:flex-row">
        <div className="font-display text-lg font-bold tracking-tight">
          Aether<span className="text-brand">Homes</span>
        </div>
        <p className="text-xs text-ink/45">© 2026 AetherHomes Inc.</p>
        <div className="flex gap-5 text-xs font-medium text-ink/60">
          <Link to="/search" search={{}} className="hover:text-ink">
            Browse
          </Link>
          <Link to="/saved" className="hover:text-ink">
            Saved
          </Link>
          <Link to="/auth" className="hover:text-ink">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
