import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProperty } from "@/lib/properties.functions";
import { GlassBackdrop } from "@/components/glass-backdrop";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPrice, imageFor, propertyImages } from "@/lib/property-images";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => getProperty({ data: { id } }),
  });

export const Route = createFileRoute("/property/$id")({
  loader: async ({ context, params }) => {
    const property = await context.queryClient.ensureQueryData(propertyQuery(params.id));
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.title} — ${formatPrice(loaderData.price)} in ${loaderData.city}`,
          },
          { name: "description", content: loaderData.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.title} — ${formatPrice(loaderData.price)}` },
          { property: "og:description", content: loaderData.description.slice(0, 155) },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
  }),
  component: PropertyPage,
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center px-8 text-center">
      <p className="text-sm text-ink/60">This listing could not be loaded.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-8 text-center">
      <div>
        <p className="font-display text-2xl font-bold">Listing not found</p>
        <Link to="/search" search={{}} className="mt-4 inline-block text-sm text-brand">
          Back to search
        </Link>
      </div>
    </div>
  ),
});

function PropertyPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(propertyQuery(id));
  const property = data!;
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [active, setActive] = useState(property.image_key);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    supabase
      .from("saved_homes")
      .select("id")
      .eq("property_id", property.id)
      .maybeSingle()
      .then(({ data: row }) => setSaved(Boolean(row)));
  }, [user, property.id]);

  async function toggleSave() {
    if (!user) {
      toast.error("Sign in to save homes");
      return;
    }
    if (saved) {
      await supabase.from("saved_homes").delete().eq("property_id", property.id);
      setSaved(false);
      toast.success("Removed from saved homes");
    } else {
      const { error } = await supabase
        .from("saved_homes")
        .insert({ property_id: property.id, user_id: user.id });
      if (error) {
        toast.error("Could not save this home");
        return;
      }
      setSaved(true);
      toast.success("Saved to your homes");
    }
  }

  const gallery = ["living", "kitchen", "bedroom", "hero"].filter((k) => k in propertyImages);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body text-ink">
      <GlassBackdrop />
      <SiteHeader />

      <main className="relative z-20 mx-auto max-w-7xl px-8 pb-24">
        <Link to="/search" search={{}} className="text-sm font-semibold text-brand hover:text-ink">
          ← Back to search
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <img
              src={imageFor(active)}
              alt={`${property.title} interior`}
              width={1088}
              height={720}
              className="aspect-[3/2] w-full rounded-[30px] border border-white/60 object-cover shadow-2xl shadow-sky-900/15"
            />
            <div className="mt-4 flex gap-3">
              {gallery.map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`overflow-hidden rounded-2xl border transition-opacity ${
                    active === key ? "border-brand" : "border-white/60 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View ${key} photo`}
                >
                  <img
                    src={imageFor(key)}
                    alt={`${property.title} ${key}`}
                    loading="lazy"
                    width={160}
                    height={120}
                    className="h-20 w-28 object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/60 bg-white/55 p-7 shadow-xl shadow-sky-900/5 backdrop-blur-2xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight">
                    {property.title}
                  </h1>
                  <p className="mt-1 text-sm text-ink/55">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                <p className="font-display text-3xl font-bold">{formatPrice(property.price)}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["Beds", property.beds],
                  ["Baths", property.baths],
                  ["Sqft", property.sqft.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs tracking-[0.15em] text-ink/45 uppercase">{label}</p>
                    <p className="mt-1 font-display text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-ink/70">{property.description}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={toggleSave}
                  className="gradient-brand rounded-2xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-sky-500/30 hover:opacity-95"
                >
                  {saved ? "Saved ✓" : "Save home"}
                </button>
                <span className="rounded-2xl border border-white/60 bg-white/50 px-6 py-3 text-sm font-medium text-ink/60 backdrop-blur-xl">
                  {property.property_type} · {property.status}
                </span>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-white/60 bg-white/55 p-7 shadow-xl shadow-sky-900/5 backdrop-blur-2xl lg:sticky lg:top-6">
            <p className="text-xs tracking-[0.15em] text-ink/45 uppercase">Contact agent</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="gradient-brand grid size-11 place-items-center rounded-xl font-display font-bold text-primary-foreground">
                {property.agent_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <p className="text-sm font-semibold">{property.agent_name}</p>
                <p className="text-xs text-ink/50">{property.agent_title}</p>
              </div>
            </div>

            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(`Tour request sent to ${property.agent_name}`);
                setForm({ name: "", email: "", message: "" });
              }}
            >
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                aria-label="Your name"
                className="w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none placeholder:text-ink/40"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                aria-label="Your email"
                className="w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none placeholder:text-ink/40"
              />
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="I'd love to schedule a tour…"
                aria-label="Message"
                className="w-full resize-none rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none placeholder:text-ink/40"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-ink/20 hover:bg-ink/90"
              >
                Request a tour
              </button>
            </form>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
