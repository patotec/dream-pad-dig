import living from "@/assets/room-living.jpg";
import kitchen from "@/assets/room-kitchen.jpg";
import bedroom from "@/assets/room-bedroom.jpg";
import hero from "@/assets/hero-home.jpg";

export const propertyImages: Record<string, string> = {
  living,
  kitchen,
  bedroom,
  hero,
};

export function imageFor(key: string | null | undefined) {
  return propertyImages[key ?? "living"] ?? living;
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString("en-US")}`;
}
