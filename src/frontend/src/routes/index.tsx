import { LandingHero } from "@/components/home/LandingHero";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListingCard } from "@/components/shared/ListingCard";
import { ListingGridSkeleton } from "@/components/shared/Skeletons";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useBrowseListings, useCategories } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Search, SearchX, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { Route as appLayoutRoute } from "./app-layout";

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

function BrowseScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<bigint | undefined>(undefined);
  const debouncedSearch = useDebounced(search, 300);

  const categories = useCategories();
  const listings = useBrowseListings({
    categoryId,
    search: debouncedSearch.trim() === "" ? undefined : debouncedSearch.trim(),
  });

  const hasFilters = !!categoryId || debouncedSearch.trim() !== "";
  const showHero = !isAuthenticated && !isLoading;

  return (
    <div className="space-y-4">
      {showHero && <LandingHero />}

      <div
        id="marketplace"
        className={cn("scroll-mt-20 space-y-4", showHero && "pt-2")}
      >
        {isAuthenticated && user && (
          <h1 className="animate-fade-in font-display text-xl font-bold">
            Namaste, {user.name.split(" ")[0] || "there"}
          </h1>
        )}

        {showHero && (
          <h2 className="font-display text-lg font-semibold">
            Live on CropVibe
          </h2>
        )}

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tomatoes, wheat, seeds…"
            className="h-11 pl-9"
            aria-label="Search listings"
          />
        </div>

        <fieldset className="flex gap-2 overflow-x-auto pb-1">
          <legend className="sr-only">Filter by category</legend>
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={cn(
              "tap-target whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              categoryId === undefined
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={categoryId === undefined}
          >
            All
          </button>
          {(categories.data ?? []).map((category) => (
            <button
              key={category.id.toString()}
              type="button"
              onClick={() =>
                setCategoryId(
                  categoryId === category.id ? undefined : category.id,
                )
              }
              className={cn(
                "tap-target whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                categoryId === category.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={categoryId === category.id}
            >
              {category.name}
            </button>
          ))}
        </fieldset>

        {listings.isPending ? (
          <ListingGridSkeleton />
        ) : listings.isError ? (
          <ErrorState
            error={listings.error}
            onRetry={() => listings.refetch()}
          />
        ) : listings.data.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No listings match"
              description="Try a different search term or clear the category filter to see everything that's live."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setCategoryId(undefined);
              }}
            />
          ) : (
            <EmptyState
              icon={Sprout}
              title="No listings yet"
              description="Be the first to sell on CropVibe — list your produce in under two minutes."
              actionLabel="Start selling"
              onAction={() => navigate({ to: "/sell" })}
            />
          )
        ) : (
          <div className="animate-fade-in grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {listings.data.map((listing) => (
              <ListingCard key={listing.id.toString()} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: BrowseScreen,
});
