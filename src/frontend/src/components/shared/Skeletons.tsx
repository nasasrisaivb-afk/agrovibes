import { Skeleton } from "@/components/ui/skeleton";

/** Skeletons for content lists — no blank screens during fetch. */

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }, (_, i) => `listing-skeleton-${i}`).map(
        (id) => (
          <div
            key={id}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => `row-skeleton-${i}`).map((id) => (
        <div
          key={id}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading details">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
