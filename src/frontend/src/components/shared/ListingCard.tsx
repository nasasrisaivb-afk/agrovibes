import type { PublicListing } from "@/backend";
import { formatInr } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";

export function ListingCard({ listing }: { listing: PublicListing }) {
  const image = listing.images[0]?.url;
  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id.toString() }}
      className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
      aria-label={`${listing.title}, ${formatInr(listing.priceInr)} per ${listing.unit}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No photo
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
          {listing.categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          {listing.title}
        </h3>
        <p className="font-mono text-base font-semibold text-primary">
          {formatInr(listing.priceInr)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            / {listing.unit}
          </span>
        </p>
        <div className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{listing.sellerName}</span>
          {listing.sellerKycVerified && (
            <span
              className="inline-flex items-center gap-0.5 text-trust"
              title="KYC verified seller"
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">KYC verified seller</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
