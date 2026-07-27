import { OrderStatus, type PublicListing } from "@/backend";
import { LandingHero } from "@/components/home/LandingHero";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListingCard } from "@/components/shared/ListingCard";
import { ListingGridSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useBrowseListings, useCategories, useMyOrders } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpDown,
  Package,
  Search,
  SearchX,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Route as appLayoutRoute } from "./app-layout";

type SortKey = "relevance" | "newest" | "price-asc" | "price-desc";

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

function applyClientFilters(
  listings: PublicListing[],
  sort: SortKey,
  priceMax: number | undefined,
): PublicListing[] {
  let next = listings;
  if (priceMax !== undefined && priceMax > 0) {
    next = next.filter((l) => Number(l.priceInr) <= priceMax);
  }
  if (sort === "newest") {
    return [...next].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }
  if (sort === "price-asc") {
    return [...next].sort((a, b) => Number(a.priceInr) - Number(b.priceInr));
  }
  if (sort === "price-desc") {
    return [...next].sort((a, b) => Number(b.priceInr) - Number(a.priceInr));
  }
  return next;
}

function SignedInWelcome({
  firstName,
  isSeller,
}: {
  firstName: string;
  isSeller: boolean;
}) {
  const navigate = useNavigate();
  const orders = useMyOrders();
  const openCount = (orders.data ?? []).filter((o) => {
    const s = o.order.status;
    return (
      s !== OrderStatus.COMPLETED &&
      s !== OrderStatus.CANCELLED &&
      s !== OrderStatus.RESOLVED
    );
  }).length;

  return (
    <section className="animate-fade-in space-y-4" aria-label="Welcome">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Namaste, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Fresh harvest and farm inputs from KYC-verified sellers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() =>
            document.getElementById("marketplace")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="card-hover flex flex-col items-start gap-2 rounded-xl border border-border bg-card/80 p-3 text-left backdrop-blur sm:p-4"
        >
          <Search className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">Browse market</span>
          <span className="text-xs text-muted-foreground">
            Search produce & inputs
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/orders" })}
          className="card-hover flex flex-col items-start gap-2 rounded-xl border border-border bg-card/80 p-3 text-left backdrop-blur sm:p-4"
        >
          <Package className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">
            Orders{openCount > 0 ? ` · ${openCount}` : ""}
          </span>
          <span className="text-xs text-muted-foreground">
            Track deliveries
          </span>
        </button>
        <button
          type="button"
          onClick={() =>
            navigate({
              to: isSeller ? "/sell" : "/auth",
              search: isSeller ? undefined : { addRole: "SELLER" },
            })
          }
          className="card-hover col-span-2 flex flex-col items-start gap-2 rounded-xl border border-border bg-card/80 p-3 text-left backdrop-blur sm:col-span-1 sm:p-4"
        >
          <Sprout className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">
            {isSeller ? "Seller hub" : "Start selling"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isSeller ? "Listings & payouts" : "List your harvest"}
          </span>
        </button>
      </div>
    </section>
  );
}

function BrowseScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isSeller, user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<bigint | undefined>(undefined);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [priceMax, setPriceMax] = useState<string>("");
  const debouncedSearch = useDebounced(search, 300);

  const categories = useCategories();
  const listings = useBrowseListings({
    categoryId,
    search: debouncedSearch.trim() === "" ? undefined : debouncedSearch.trim(),
  });

  const priceMaxNum = priceMax.trim() === "" ? undefined : Number(priceMax);
  const filtered = useMemo(
    () =>
      applyClientFilters(
        listings.data ?? [],
        sort,
        Number.isFinite(priceMaxNum) ? priceMaxNum : undefined,
      ),
    [listings.data, sort, priceMaxNum],
  );

  const hasFilters =
    !!categoryId ||
    debouncedSearch.trim() !== "" ||
    sort !== "relevance" ||
    (priceMaxNum !== undefined && priceMaxNum > 0);
  const showHero = !isAuthenticated && !isLoading;

  return (
    <div className={cn(showHero ? "space-y-0" : "space-y-5")}>
      {showHero && <LandingHero />}

      <div
        id="marketplace"
        className={cn(
          "scroll-mt-20 space-y-4",
          showHero && "mx-auto max-w-5xl px-4 py-8 md:px-8",
        )}
      >
        {isAuthenticated && user && (
          <SignedInWelcome
            firstName={user.name.split(" ")[0] || "there"}
            isSeller={isSeller}
          />
        )}

        {showHero && (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold md:text-2xl">
                Live on CropVibe
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified sellers. Transparent prices. Direct from the farm.
              </p>
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-trust">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              KYC-backed marketplace
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
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
          <div className="flex gap-2">
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger
                className="h-11 w-[158px] shrink-0"
                aria-label="Sort listings"
              >
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low–high</SelectItem>
                <SelectItem value="price-desc">Price: high–low</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Max ₹"
              className="h-11 w-[100px] shrink-0 font-mono"
              aria-label="Maximum price in rupees"
            />
          </div>
        </div>

        <fieldset className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        {hasFilters && (
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {listings.isPending
                ? "Searching…"
                : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setSearch("");
                setCategoryId(undefined);
                setSort("relevance");
                setPriceMax("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {listings.isPending ? (
          <ListingGridSkeleton />
        ) : listings.isError ? (
          <ErrorState
            error={listings.error}
            onRetry={() => listings.refetch()}
          />
        ) : filtered.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No listings match"
              description="Try a different search term or clear filters to see everything that's live."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setCategoryId(undefined);
                setSort("relevance");
                setPriceMax("");
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
            {filtered.map((listing, i) => (
              <div
                key={listing.id.toString()}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
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
