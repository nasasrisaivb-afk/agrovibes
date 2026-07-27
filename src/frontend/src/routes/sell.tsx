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

function ListingRow({
  listing,
  onGate,
}: {
  listing: Listing;
  onGate: (gate: KycGateState) => void;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Actions for ${listing.title}`}
                className="tap-target -mr-1 -mt-1 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
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
            <Label htmlFor="restock-qty">New quantity</Label>
            <Input
              id="restock-qty"
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
  const openOrders = (orders.data ?? []).filter((o) =>
    [
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.IN_PROGRESS,
    ].includes(o.order.status),
  ).length;
  const totalSales = (orders.data ?? [])
    .filter((o) => o.order.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + Number(o.order.totalAmountInr), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-xl font-bold">Seller hub</h1>
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

      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: Sprout,
            label: "Live listings",
            value: activeCount.toString(),
          },
          { icon: Package, label: "Open orders", value: openOrders.toString() },
          {
            icon: IndianRupee,
            label: "Completed sales",
            value: formatInr(totalSales),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-3 text-center"
          >
            <stat.icon
              className="mx-auto h-4 w-4 text-primary"
              aria-hidden="true"
            />
            <p className="mt-1 truncate font-mono text-base font-bold">
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-semibold">My listings</h2>
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
        <div className="space-y-3">
          {data.map((listing) => (
            <ListingRow
              key={listing.id.toString()}
              listing={listing}
              onGate={setGate}
            />
          ))}
        </div>
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
