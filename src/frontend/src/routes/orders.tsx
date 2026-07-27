import type { OrderView } from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders, useSellerOrders } from "@/lib/backend";
import { formatInr, timeAgo } from "@/lib/format";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";
import { useState } from "react";
import { Route as appLayoutRoute } from "./app-layout";

function OrderCard({
  view,
  perspective,
}: { view: OrderView; perspective: "buyer" | "seller" }) {
  return (
    <Link
      to="/orders/$id"
      params={{ id: view.order.id.toString() }}
      className="card-hover flex gap-3 rounded-xl border border-border bg-card p-3"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {view.listingImageUrl ? (
          <img
            src={view.listingImageUrl}
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
          <p className="line-clamp-1 text-sm font-medium">
            {view.listingTitle}
          </p>
          <span className="whitespace-nowrap font-mono text-sm font-semibold text-primary">
            {formatInr(view.order.totalAmountInr)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          #{view.order.id.toString()} · {view.order.quantity.toString()}{" "}
          {view.listingUnit} ·{" "}
          {perspective === "buyer"
            ? `from ${view.sellerName}`
            : `for ${view.buyerName}`}{" "}
          · {timeAgo(view.order.createdAt)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <OrderStatusBadge status={view.order.status} />
          <PaymentStatusBadge status={view.order.paymentStatus} />
        </div>
      </div>
    </Link>
  );
}

function OrdersScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isLoading } = useAuth();
  const [tab, setTab] = useState<"purchases" | "sales">("purchases");
  const myOrders = useMyOrders();
  const sellerOrders = useSellerOrders(isSeller);

  if (!isAuthenticated && !isLoading) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="Sign in to see your orders"
        description="Your purchases and sales will show up here once you're signed in."
        actionLabel="Sign in"
        onAction={() => navigate({ to: "/auth", search: {} })}
      />
    );
  }

  const active = tab === "purchases" ? myOrders : sellerOrders;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold">Orders</h1>

      {isSeller && (
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "purchases" | "sales")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases">My purchases</TabsTrigger>
            <TabsTrigger value="sales">My sales</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {active.isPending || isLoading ? (
        <ListSkeleton rows={4} />
      ) : active.isError ? (
        <ErrorState error={active.error} onRetry={() => active.refetch()} />
      ) : (active.data ?? []).length === 0 ? (
        tab === "purchases" ? (
          <EmptyState
            icon={PackageOpen}
            title="No purchases yet"
            description="Fresh produce and farm inputs from verified sellers are one tap away."
            actionLabel="Browse the marketplace"
            onAction={() => navigate({ to: "/" })}
          />
        ) : (
          <EmptyState
            icon={PackageOpen}
            title="No sales yet"
            description="Once buyers place orders on your listings, they'll appear here for you to confirm and fulfil."
            actionLabel="Manage my listings"
            onAction={() => navigate({ to: "/sell" })}
          />
        )
      ) : (
        <div className="space-y-3">
          {(active.data ?? []).map((view) => (
            <OrderCard
              key={view.order.id.toString()}
              view={view}
              perspective={tab === "purchases" ? "buyer" : "seller"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/orders",
  component: OrdersScreen,
});
