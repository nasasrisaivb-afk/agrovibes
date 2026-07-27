import { KycStatus, type Listing, ListingStatus, OrderStatus } from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  KycGateDialog,
  type KycGateState,
} from "@/components/shared/KycGateDialog";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { ListingStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  useManageListing,
  useMyListings,
  useSellerOrders,
  useSubmitListingForPublish,
} from "@/lib/backend";
import { errorMessage, kycGateFromError } from "@/lib/errors";
import { formatInr } from "@/lib/format";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import {
  IndianRupee,
  MoreVertical,
  Package,
  Plus,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as appLayoutRoute } from "./app-layout";

function ListingActions({
  listing,
  onGate,
  compact = false,
}: {
  listing: Listing;
  onGate: (gate: KycGateState) => void;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const manage = useManageListing();
  const submit = useSubmitListingForPublish();
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockQty, setRestockQty] = useState("");

  const act = (
    action: Parameters<typeof manage.mutate>[0]["action"],
    successMessage: string,
  ) => {
    manage.mutate(
      { listingId: listing.id, action },
      {
        onSuccess: () => toast.success(successMessage),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  const publish = () => {
    submit.mutate(listing.id, {
      onSuccess: (updated) =>
        toast.success(
          updated.status === ListingStatus.PUBLISHED
            ? "Listing is live!"
            : "Listing submitted for review — it goes live after approval.",
        ),
      onError: (error) => {
        const gate = kycGateFromError(error);
        if (gate) onGate(gate);
        else toast.error(errorMessage(error));
      },
    });
  };

  const s = listing.status;
  const editable = s === ListingStatus.DRAFT || s === ListingStatus.REJECTED;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${listing.title}`}
            className={`tap-target flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground ${
              compact ? "" : "-mr-1 -mt-1"
            }`}
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {s === ListingStatus.DRAFT && (
            <DropdownMenuItem onClick={publish}>Publish</DropdownMenuItem>
          )}
          {editable && (
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/sell/edit/$id",
                  params: { id: listing.id.toString() },
                })
              }
            >
              Edit
            </DropdownMenuItem>
          )}
          {s === ListingStatus.PUBLISHED && (
            <DropdownMenuItem
              onClick={() =>
                act({ __kind__: "Pause", Pause: null }, "Listing paused.")
              }
            >
              Pause
            </DropdownMenuItem>
          )}
          {s === ListingStatus.PAUSED && (
            <DropdownMenuItem
              onClick={() =>
                act(
                  { __kind__: "Resume", Resume: null },
                  "Listing is live again.",
                )
              }
            >
              Resume
            </DropdownMenuItem>
          )}
          {(s === ListingStatus.SOLD_OUT ||
            s === ListingStatus.PUBLISHED ||
            s === ListingStatus.PAUSED) && (
            <DropdownMenuItem onClick={() => setRestockOpen(true)}>
              Restock
            </DropdownMenuItem>
          )}
          {s !== ListingStatus.PUBLISHED &&
            s !== ListingStatus.ARCHIVED &&
            s !== ListingStatus.PENDING_REVIEW && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  act(
                    { __kind__: "Archive", Archive: null },
                    "Listing archived.",
                  )
                }
              >
                Archive
              </DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Restock listing</DialogTitle>
            <DialogDescription>
              Set the new available quantity ({listing.unit}). The listing goes
              live immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`restock-qty-${listing.id}`}>New quantity</Label>
            <Input
              id={`restock-qty-${listing.id}`}
              type="number"
              min="1"
              inputMode="numeric"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              className="tap-target w-full"
              disabled={!(Number(restockQty) > 0) || manage.isPending}
              onClick={() => {
                act(
                  {
                    __kind__: "Restock",
                    Restock: BigInt(Math.round(Number(restockQty))),
                  },
                  "Restocked and live.",
                );
                setRestockOpen(false);
              }}
            >
              Update stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ListingRow({
  listing,
  onGate,
}: {
  listing: Listing;
  onGate: (gate: KycGateState) => void;
}) {
  const s = listing.status;

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {listing.images[0] ? (
          <img
            src={listing.images[0].url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
            No photo
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm font-medium">{listing.title}</p>
          <ListingActions listing={listing} onGate={onGate} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatInr(listing.priceInr)} / {listing.unit} ·{" "}
          {Number(listing.quantity).toLocaleString("en-IN")} {listing.unit} left
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <ListingStatusBadge status={s} />
          {listing.moderationNote && (
            <span
              className="text-xs text-warning"
              title={listing.moderationNote}
            >
              Note: {listing.moderationNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SellScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isLoading, user } = useAuth();
  const listings = useMyListings();
  const orders = useSellerOrders(isSeller);
  const [gate, setGate] = useState<KycGateState | null>(null);

  if (isLoading) return <ListSkeleton rows={3} />;

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={Sprout}
        title="Sell on CropVibe"
        description="List your harvest in under two minutes and reach buyers across India. Sign in to get started."
        actionLabel="Sign in to sell"
        onAction={() => navigate({ to: "/auth", search: {} })}
      />
    );
  }

  if (!isSeller) {
    return (
      <EmptyState
        icon={Sprout}
        title="Become a seller"
        description="Add the seller role to your account — you'll pick your main category and can start listing right away."
        actionLabel="Set up my seller profile"
        onAction={() =>
          navigate({ to: "/auth", search: { addRole: "SELLER" } })
        }
      />
    );
  }

  const data = listings.data ?? [];
  const activeCount = data.filter(
    (l) => l.status === ListingStatus.PUBLISHED,
  ).length;
  const draftCount = data.filter(
    (l) => l.status === ListingStatus.DRAFT,
  ).length;
  const pendingCount = data.filter(
    (l) => l.status === ListingStatus.PENDING_REVIEW,
  ).length;
  const openOrders = (orders.data ?? []).filter((o) =>
    [
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.IN_PROGRESS,
    ].includes(o.order.status),
  ).length;
  const completedOrders = (orders.data ?? []).filter(
    (o) => o.order.status === OrderStatus.COMPLETED,
  );
  const totalSales = completedOrders.reduce(
    (sum, o) => sum + Number(o.order.totalAmountInr),
    0,
  );
  const avgOrder =
    completedOrders.length > 0
      ? Math.round(totalSales / completedOrders.length)
      : 0;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold md:text-2xl">
            Seller hub
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage listings, fulfilment, and earnings.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/sell/new" })}
          className="tap-target"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" /> New listing
        </Button>
      </div>

      {user?.kycStatus !== KycStatus.VERIFIED && (
        <Link
          to="/kyc"
          className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm transition-colors hover:bg-primary/15"
        >
          <ShieldCheck
            className="h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>
            <span className="font-medium text-primary">
              Complete verification to publish listings.
            </span>{" "}
            <span className="text-muted-foreground">
              Drafts are always saved — publishing needs KYC.
            </span>
          </span>
        </Link>
      )}

      {/* Analytics strip — denser on desktop (BRD 12.3) */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            icon: Sprout,
            label: "Live",
            value: activeCount.toString(),
          },
          {
            icon: Package,
            label: "Open orders",
            value: openOrders.toString(),
          },
          {
            icon: IndianRupee,
            label: "Sales",
            value: formatInr(totalSales),
          },
          {
            icon: IndianRupee,
            label: "Avg order",
            value: avgOrder > 0 ? formatInr(avgOrder) : "—",
            desktopOnly: true,
          },
          {
            icon: Sprout,
            label: "Drafts / review",
            value: `${draftCount} / ${pendingCount}`,
            desktopOnly: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-border bg-card/80 p-3 text-center backdrop-blur sm:p-4 ${
              "desktopOnly" in stat && stat.desktopOnly ? "hidden lg:block" : ""
            }`}
          >
            <stat.icon
              className="mx-auto h-4 w-4 text-primary"
              aria-hidden="true"
            />
            <p className="mt-1 truncate font-mono text-base font-bold md:text-lg">
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground md:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold md:text-lg">
          My listings
        </h2>
        {data.length > 0 && (
          <p className="text-xs text-muted-foreground">{data.length} total</p>
        )}
      </div>

      {listings.isPending ? (
        <ListSkeleton rows={3} />
      ) : listings.isError ? (
        <ErrorState error={listings.error} onRetry={() => listings.refetch()} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No listings yet"
          description="Create your first listing — it takes about two minutes, and you can save a draft any time."
          actionLabel="Create a listing"
          onAction={() => navigate({ to: "/sell/new" })}
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 lg:hidden">
            {data.map((listing) => (
              <ListingRow
                key={listing.id.toString()}
                listing={listing}
                onGate={setGate}
              />
            ))}
          </div>

          {/* Desktop table — bulk management surface (BRD 12.3) */}
          <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Your listings</caption>
              <thead className="border-b border-border bg-card/80 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Listing
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((listing) => (
                  <tr
                    key={listing.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-accent/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {listing.images[0]?.url ? (
                            <img
                              src={listing.images[0].url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {listing.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {listing.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-primary">
                      {formatInr(listing.priceInr)}
                      <span className="text-muted-foreground">
                        {" "}
                        / {listing.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {Number(listing.quantity).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <ListingStatusBadge status={listing.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex justify-end">
                        <ListingActions
                          listing={listing}
                          onGate={setGate}
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <KycGateDialog gate={gate} onClose={() => setGate(null)} />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sell",
  component: SellScreen,
});
