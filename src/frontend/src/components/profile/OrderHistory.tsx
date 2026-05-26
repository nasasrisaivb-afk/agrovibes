import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetListings, useGetOrders } from "../../lib/backend";
import { OrderStatus } from "../../types";
import { DisputeFlowModal } from "./DisputeFlowModal";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.Delivered]: {
      label: "Delivered",
      className: "bg-success/10 text-success border-success/30",
    },
    [OrderStatus.Shipped]: {
      label: "Shipped",
      className: "bg-trust/10 text-trust border-trust/30",
    },
    [OrderStatus.Pending]: {
      label: "Pending",
      className: "bg-warning/10 text-warning border-warning/30",
    },
    [OrderStatus.Confirmed]: {
      label: "Confirmed",
      className: "bg-accent/10 text-accent-foreground border-accent/30",
    },
    [OrderStatus.Disputed]: {
      label: "Disputed",
      className: "bg-destructive/10 text-destructive border-destructive/30",
    },
  };

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ITEM_NAMES: Record<string, string> = {
  "1021": "Organic Red Tomatoes",
  "1019": "Desi Basmati Rice",
  "1015": "Alphonso Mangoes",
  "1010": "Fresh Spinach Bunch",
  "1005": "A2 Desi Cow Ghee",
};

const ESCROW_ORDERS = new Set(["1019", "1015"]);

export function OrderHistory() {
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const { data: listings } = useGetListings();
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);

  const getListingName = (listingId: bigint): string => {
    const listing = listings?.find((l) => l.id === listingId);
    return listing?.name ?? `Listing #${listingId}`;
  };

  if (ordersLoading) {
    return (
      <section>
        <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
          Order History
        </h2>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  const displayOrders =
    orders && orders.length > 0
      ? orders
      : [
          {
            id: BigInt(1021),
            listingId: BigInt(1),
            quantity: BigInt(5),
            total: 225,
            createdAt: BigInt(Date.now() * 1_000_000 - 2 * 86400 * 1e9),
            status: OrderStatus.Delivered,
            buyerId: BigInt(1),
          },
          {
            id: BigInt(1019),
            listingId: BigInt(3),
            quantity: BigInt(10),
            total: 950,
            createdAt: BigInt(Date.now() * 1_000_000 - 5 * 86400 * 1e9),
            status: OrderStatus.Shipped,
            buyerId: BigInt(1),
          },
          {
            id: BigInt(1015),
            listingId: BigInt(5),
            quantity: BigInt(2),
            total: 360,
            createdAt: BigInt(Date.now() * 1_000_000 - 10 * 86400 * 1e9),
            status: OrderStatus.Confirmed,
            buyerId: BigInt(1),
          },
          {
            id: BigInt(1010),
            listingId: BigInt(2),
            quantity: BigInt(1),
            total: 180,
            createdAt: BigInt(Date.now() * 1_000_000 - 15 * 86400 * 1e9),
            status: OrderStatus.Pending,
            buyerId: BigInt(1),
          },
          {
            id: BigInt(1005),
            listingId: BigInt(4),
            quantity: BigInt(3),
            total: 540,
            createdAt: BigInt(Date.now() * 1_000_000 - 20 * 86400 * 1e9),
            status: OrderStatus.Disputed,
            buyerId: BigInt(1),
          },
        ];

  return (
    <>
      <section>
        <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
          Order History
        </h2>

        {displayOrders.length === 0 ? (
          <div
            className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center gap-3 text-center"
            data-ocid="orders.empty_state"
          >
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs text-muted-foreground">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {displayOrders.map((order, idx) => {
              const orderId = `ORD-${order.id}`;
              const itemName =
                ITEM_NAMES[String(order.id)] ?? getListingName(order.listingId);
              const statusConf =
                STATUS_CONFIG[order.status] ??
                STATUS_CONFIG[OrderStatus.Pending];
              const isDelivered = order.status === OrderStatus.Delivered;
              const isShipped = order.status === OrderStatus.Shipped;
              const isDisputed = order.status === OrderStatus.Disputed;
              const hasEscrow = ESCROW_ORDERS.has(String(order.id));

              return (
                <div
                  key={String(order.id)}
                  className="bg-card rounded-2xl border border-border p-3.5 flex flex-col gap-2.5"
                  data-ocid={`orders.item.${idx + 1}`}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {itemName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {orderId} · Qty: {String(order.quantity)} ·{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-bold text-sm">₹{order.total}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 border ${statusConf.className}`}
                      >
                        {statusConf.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Escrow indicator */}
                  {hasEscrow && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-trust/5 border border-trust/20 rounded-xl">
                      <ShieldCheck className="h-3 w-3 text-trust flex-shrink-0" />
                      <span className="text-[10px] text-trust font-medium">
                        Escrow protected · ₹{order.total} held safely
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  {(isDelivered || isShipped || isDisputed) && (
                    <div className="flex gap-2">
                      {isDelivered && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-[10px] border-destructive/30 text-destructive hover:bg-destructive/5"
                            onClick={() => setDisputeOrderId(orderId)}
                            data-ocid={`orders.dispute-btn.${idx + 1}`}
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Raise Dispute
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-[10px]"
                            onClick={() => toast.info("Re-ordering...")}
                            data-ocid={`orders.reorder-btn.${idx + 1}`}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Re-order
                          </Button>
                        </>
                      )}
                      {isShipped && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-[10px] border-trust/30 text-trust hover:bg-trust/5"
                          onClick={() =>
                            toast.info("Tracking", {
                              description: "Shipment tracking coming soon",
                            })
                          }
                          data-ocid={`orders.track-btn.${idx + 1}`}
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Track Shipment
                        </Button>
                      )}
                      {isDisputed && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-[10px] border-destructive/30 text-destructive"
                          onClick={() => setDisputeOrderId(orderId)}
                          data-ocid={`orders.view-dispute-btn.${idx + 1}`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          View Dispute
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {disputeOrderId && (
        <DisputeFlowModal
          orderId={disputeOrderId}
          open={!!disputeOrderId}
          onClose={() => setDisputeOrderId(null)}
        />
      )}
    </>
  );
}
