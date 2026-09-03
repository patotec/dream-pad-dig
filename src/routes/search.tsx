import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { listProperties } from "@/lib/properties.functions";
import { GlassBackdrop } from "@/components/glass-backdrop";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { formatPrice } from "@/lib/property-images";

const searchSchema = z.object({
  q: z.string().optional(),
  beds: z.number().optional(),
  maxPrice: z.number().optional(),
  type: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

const listQuery = (params: SearchParams) =>
  queryOptions({
    queryKey: ["properties", "list", params],
    queryFn: () => listProperties({ data: params }),
  });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse homes for sale — AetherHomes" },
      {
        name: "description",
        content:
          "Filter Pacific Northwest listings by location, price, beds, and property type on a map-and-list search view.",
      },
      { property: "og:title", content: "Browse homes for sale — AetherHomes" },
      {
        property: "og:description",
        content: "Map-and-list home search across Portland, Seattle, and beyond.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(listQuery(deps)),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { data: results } = useSuspenseQuery(listQuery(search));

  const update = (patch: Partial<SearchParams>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body text-ink">
      <GlassBackdrop />
      <SiteHeader />

      <main className="relative z-20 mx-auto max-w-7xl px-8 pb-24">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {results.length} home{results.length === 1 ? "" : "s"} available
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          {search.q ? `Matching “${search.q}”` : "Across the Pacific Northwest"}
        </p>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/45 p-4 shadow-xl shadow-sky-900/10 backdrop-blur-2xl sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/70 px-4 py-3">
            <span className="text-brand">⌕</span>
            <input
              value={search.q ?? ""}
              onChange={(e) => update({ q: e.target.value || undefined })}
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
              placeholder="City, neighborhood, or ZIP"
              aria-label="City, neighborhood, or ZIP"
            />
          </div>
          <select
            aria-label="Max price"
            value={search.maxPrice ?? ""}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-ink/60 outline-none"
          >
            <option value="">Any price</option>
            <option value="600000">Up to $600k</option>
            <option value="800000">Up to $800k</option>
            <option value="1200000">Up to $1.2M</option>
          </select>
          <select
            aria-label="Minimum beds"
            value={search.beds ?? ""}
            onChange={(e) => update({ beds: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-ink/60 outline-none"
          >
            <option value="">Any beds</option>
            <option value="2">2+ beds</option>
            <option value="3">3+ beds</option>
            <option value="4">4+ beds</option>
          </select>
          <select
            aria-label="Property type"
            value={search.type ?? ""}
            onChange={(e) => update({ type: e.target.value || undefined })}
            className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-ink/60 outline-none"
          >
            <option value="">Any type</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Duplex">Duplex</option>
            <option value="Cottage">Cottage</option>
          </select>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative h-[560px] overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-sky-900/10 backdrop-blur-2xl lg:sticky lg:top-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
            {results.slice(0, 6).map((p, i) => (
              <Link
                key={p.id}
                to="/property/$id"
                params={{ id: p.id }}
                className="absolute rounded-2xl bg-ink/85 px-3 py-1.5 font-display text-sm font-bold text-primary-foreground shadow-lg backdrop-blur transition-colors hover:bg-brand"
                style={{ top: `${16 + i * 13}%`, left: `${12 + ((i * 27) % 62)}%` }}
              >
                {formatPrice(p.price)}
              </Link>
            ))}
            <span className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium text-ink/50 backdrop-blur-xl">
              Neighborhood map preview
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
            {results.length === 0 && (
              <p className="rounded-3xl border border-white/60 bg-white/50 p-8 text-sm text-ink/60 backdrop-blur-2xl">
                No homes match these filters yet. Try widening the price or bed count.
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
