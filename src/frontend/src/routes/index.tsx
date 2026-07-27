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
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<bigint | undefined>(undefined);
  const debouncedSearch = useDebounced(search, 300);

  const categories = useCategories();
  const listings = useBrowseListings({
    categoryId,
    search: debouncedSearch.trim() === "" ? undefined : debouncedSearch.trim(),
  });

  const hasFilters = !!categoryId || debouncedSearch.trim() !== "";

  return (
    <div className="space-y-4">
      {!isAuthenticated && (
        <section className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-5">
          <h1 className="font-display text-2xl font-bold leading-tight">
            Farm-fresh produce,{" "}
            <span className="gold-gradient-text">direct from sellers</span>
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Buy verified produce and farm inputs, or sell your harvest across
            India. UPI-first payments, KYC-verified sellers.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth" })}
            className="tap-target mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started with your phone number
          </button>
        </section>
      )}

      {isAuthenticated && user && (
        <h1 className="font-display text-xl font-bold">
          Namaste, {user.name.split(" ")[0] || "there"} 🌾
        </h1>
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
        <ErrorState error={listings.error} onRetry={() => listings.refetch()} />
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {listings.data.map((listing) => (
            <ListingCard key={listing.id.toString()} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: BrowseScreen,
});
