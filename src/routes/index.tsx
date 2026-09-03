import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listProperties } from "@/lib/properties.functions";
import { GlassBackdrop } from "@/components/glass-backdrop";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import heroHome from "@/assets/hero-home.jpg";
import { Link } from "@tanstack/react-router";

const featuredQuery = queryOptions({
  queryKey: ["properties", "featured"],
  queryFn: () => listProperties({ data: { featuredOnly: true } }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AetherHomes — Homes for sale in the Pacific Northwest" },
      {
        name: "description",
        content:
          "Search, save, and tour verified homes for sale across Portland, Seattle, and the Pacific Northwest.",
      },
      { property: "og:title", content: "AetherHomes — Find the home that moves with you" },
      {
        property: "og:description",
        content: "Browse verified listings, filter by price and beds, and save the homes you love.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQuery),
  component: Index,
});

const quickFilters = [
  { label: "Condos", search: { type: "Condo" } },
  { label: "New build", search: { q: "Cedar" } },
  { label: "Waterfront", search: { q: "Harborview" } },
  { label: "Under $650k", search: { maxPrice: 650000 } },
] as const;

function Index() {
  const { data: featured } = useSuspenseQuery(featuredQuery);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body text-ink">
      <GlassBackdrop />
      <SiteHeader />

      <section className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 pt-10 pb-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-brand uppercase backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-accent-cyan" /> {featured.length * 800} live
            listings in Portland
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl">
            Find the home that{" "}
            <span className="gradient-brand bg-clip-text text-transparent">moves</span> with you.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
            Search, save, and tour verified homes across the Pacific Northwest — with live listing
            data.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({
                to: "/search",
                search: {
                  ...(q ? { q } : {}),
                  ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
                  ...(beds ? { beds: Number(beds) } : {}),
                },
              });
            }}
            className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/45 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-2xl sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/70 px-4 py-3">
              <span className="text-brand">⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                placeholder="City, neighborhood, or ZIP"
                aria-label="City, neighborhood, or ZIP"
              />
            </div>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              aria-label="Max price"
              className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-ink/60 outline-none"
            >
              <option value="">Any price</option>
              <option value="600000">Up to $600k</option>
              <option value="800000">Up to $800k</option>
              <option value="1200000">Up to $1.2M</option>
            </select>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              aria-label="Minimum beds"
              className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-ink/60 outline-none"
            >
              <option value="">Any beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
            </select>
            <button
              type="submit"
              className="gradient-brand rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-sky-500/30 hover:opacity-95"
            >
              Search
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-ink/50">
            {quickFilters.map((f) => (
              <Link
                key={f.label}
                to="/search"
                search={f.search}
                className="rounded-full border border-white/60 bg-white/40 px-3 py-1.5 backdrop-blur-xl hover:text-ink"
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rotate-[-6deg] rounded-[36px] border border-white/50 bg-white/20 backdrop-blur-xl" />
          <img
            src={heroHome}
            alt="Modern Pacific Northwest home with floor-to-ceiling windows among evergreens"
            width={1088}
            height={1200}
            className="relative aspect-[9/10] w-full rotate-[2deg] rounded-[30px] border border-white/60 object-cover shadow-2xl shadow-sky-900/15"
          />
          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur-xl">
            <span className="gradient-brand grid size-10 place-items-center rounded-xl text-primary-foreground">
              $
            </span>
            <div>
              <p className="font-display text-lg leading-none font-bold">$812,000</p>
              <p className="mt-1 text-xs text-ink/50">3 bd · 2 ba · 2,140 sqft</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-8 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Featured this week</h2>
            <p className="mt-2 text-sm text-ink/55">Hand-picked homes trending in the metro</p>
          </div>
          <Link
            to="/search"
            search={{}}
            className="text-sm font-semibold text-brand hover:text-ink"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
