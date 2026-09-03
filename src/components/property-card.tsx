import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/properties.functions";
import { formatPrice, imageFor } from "@/lib/property-images";

export function PropertyCard({ property }: { property: Property }) {
  const isNew = property.status !== "For sale";
  return (
    <Link
      to="/property/$id"
      params={{ id: property.id }}
      className="group block overflow-hidden rounded-3xl border border-white/60 bg-white/55 shadow-xl shadow-sky-900/5 backdrop-blur-2xl transition-transform hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={imageFor(property.image_key)}
          alt={`${property.title} in ${property.city}, ${property.state}`}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur ${
            isNew ? "bg-brand/90" : "bg-ink/85"
          }`}
        >
          {property.status}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-xl font-bold">{formatPrice(property.price)}</p>
          <p className="text-xs text-ink/45">
            {property.city}, {property.state}
          </p>
        </div>
        <p className="mt-1 text-sm font-medium text-ink/70">{property.title}</p>
        <p className="mt-3 text-xs text-ink/50">
          {property.beds} bd · {property.baths} ba · {property.sqft.toLocaleString()} sqft
        </p>
      </div>
    </Link>
  );
}
