import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { Farmer, Listing } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  listings: Listing[];
  farmers: Farmer[];
  isLoading: boolean;
  onClearFilters: () => void;
}

function getFarmer(farmers: Farmer[], farmerId: bigint) {
  return farmers.find((f) => f.id === farmerId);
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
        <div
          key={key}
          className="rounded-2xl overflow-hidden border border-border"
        >
          <Skeleton className="h-[150px] w-full rounded-none" />
          <div className="p-2.5 space-y-2">
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <Skeleton className="h-7 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div
      className="flex flex-col items-center py-16 gap-4"
      data-ocid="marketplace-empty"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <Search className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No listings found</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your search or filters
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        data-ocid="clear-filters-btn"
      >
        Clear Filters
      </Button>
    </div>
  );
}

export function ProductGrid({
  listings,
  farmers,
  isLoading,
  onClearFilters,
}: ProductGridProps) {
  if (isLoading) return <SkeletonGrid />;

  if (listings.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {listings.map((listing) => (
        <ProductCard
          key={listing.id.toString()}
          listing={listing}
          farmer={getFarmer(farmers, listing.farmerId)}
        />
      ))}
    </div>
  );
}
