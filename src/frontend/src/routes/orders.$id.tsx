import { OrderStatus, type OrderView } from "@/backend";
import { ErrorState } from "@/components/shared/ErrorState";
import { DetailSkeleton } from "@/components/shared/Skeletons";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useOrder, usePublicConfig, useTransitionOrder } from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { formatDateTime, formatInr } from "@/lib/format";
import { createRoute } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as appLayoutRoute } from "./app-layout";

interface OrderAction {
  label: string;
  to: OrderStatus;
  tone: "default" | "destructive" | "outline";
  confirmTitle: string;
  confirmBody: string;
}

/** Actions offered per role and current status — mirrors the server-side
 *  transition map; the server remains the source of truth. */
function actionsFor(
  view: OrderView,
  userId: bigint | undefined,
): OrderAction[] {
  if (userId === undefined) return [];
  const isBuyer = view.order.buyerId === userId;
  const isSeller = view.order.sellerId === userId;
  const s = view.order.status;
  const actions: OrderAction[] = [];
  if (isSeller) {
    if (s === OrderStatus.PLACED) {
      actions.push({
        label: "Confirm order",
        to: OrderStatus.CONFIRMED,
        tone: "default",
        confirmTitle: "Confirm this order?",
        confirmBody:
          "You're committing to fulfil this order. The buyer will be notified.",
      });
    }
    if (s === OrderStatus.CONFIRMED) {
      actions.push({
        label: "Start fulfilment",
        to: OrderStatus.IN_PROGRESS,
        tone: "default",
        confirmTitle: "Start fulfilment?",
        confirmBody:
          "Mark this order as being prepared/shipped. The buyer will be notified.",
      });
      actions.push({
        label: "Cancel order",
        to: OrderStatus.CANCELLED,
        tone: "destructive",
        confirmTitle: "Cancel this order?",
        confirmBody:
          "The buyer will be refunded in full and stock will be restored. This cannot be undone.",
      });
    }
    if (s === OrderStatus.IN_PROGRESS) {
      actions.push({
        label: "Mark completed",
        to: OrderStatus.COMPLETED,
        tone: "default",
        confirmTitle: "Mark as completed?",
        confirmBody:
          "Confirm the buyer has received the goods. Your payout will be scheduled after the hold period.",
      });
    }
  }
  if (isBuyer) {
    if (s === OrderStatus.PLACED || s === OrderStatus.CONFIRMED) {
      actions.push({
        label: "Cancel order",
        to: OrderStatus.CANCELLED,
        tone: "destructive",
        confirmTitle: "Cancel this order?",
        confirmBody:
          "You'll receive a full refund to your original payment method. This cannot be undone.",
      });
    }
    if (s === OrderStatus.IN_PROGRESS || s === OrderStatus.COMPLETED) {
      actions.push({
        label: "Raise a dispute",
        to: OrderStatus.DISPUTED,
        tone: "outline",
        confirmTitle: "Raise a dispute?",
        confirmBody:
          "Open a dispute if the goods were not delivered or not as described. Our support team will review it within 24 hours.",
      });
    }
  }
  return actions;
}

function OrderDetailScreen() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const order = useOrder(BigInt(id));
  const transition = useTransitionOrder();
  const publicConfig = usePublicConfig();
  const [pendingAction, setPendingAction] = useState<OrderAction | null>(null);

  if (order.isPending) return <DetailSkeleton />;
  if (order.isError)
    return (
      <ErrorState
        error={order.error}
        onRetry={() => order.refetch()}
        retryLabel="Reload order"
      />
    );

  const view = order.data;
  const actions = actionsFor(view, user?.id);
  const isSeller = view.order.sellerId === user?.id;
  const holdHours = publicConfig.data
    ? Number(publicConfig.data.payoutHoldHours)
    : null;

  const runAction = (action: OrderAction) => {
    transition.mutate(
      { orderId: view.order.id, newStatus: action.to },
      {
        onSuccess: () =>
          toast.success(`Order updated: ${action.label.toLowerCase()} done.`),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
    setPendingAction(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="tap-target inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to orders
      </button>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Order #{view.order.id.toString()}
            </p>
            <h1 className="font-display text-lg font-bold leading-snug">
              {view.listingTitle}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {view.order.quantity.toString()} {view.listingUnit} ·{" "}
              {isSeller
                ? `Buyer: ${view.buyerName}`
                : `Seller: ${view.sellerName}`}
            </p>
          </div>
          {view.listingImageUrl && (
            <img
              src={view.listingImageUrl}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={view.order.status} />
          <PaymentStatusBadge status={view.order.paymentStatus} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Total paid</span>
          <span className="font-mono text-lg font-bold text-primary">
            {formatInr(view.order.totalAmountInr)}
          </span>
        </div>
        {isSeller &&
          view.order.status === OrderStatus.COMPLETED &&
          holdHours !== null && (
            <p className="mt-2 text-xs text-muted-foreground">
              Payout is scheduled {holdHours} hours after completion (minus
              platform commission). Track it in Profile → Payouts.
            </p>
          )}
      </div>

      {actions.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.tone === "default" ? "default" : action.tone}
              disabled={transition.isPending}
              onClick={() => setPendingAction(action)}
              className="tap-target flex-1"
            >
              {transition.isPending && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {view.order.status === OrderStatus.DISPUTED && (
        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          A dispute is open on this order. Our support team typically responds
          within 24 hours.
        </p>
      )}

      <section
        aria-label="Order timeline"
        className="rounded-2xl border border-border bg-card p-4"
      >
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Timeline
        </h2>
        <ol className="mt-3 space-y-4">
          {[...view.order.timeline].reverse().map((event, i) => (
            <li
              key={`${event.at.toString()}-${i}`}
              className="relative flex gap-3 pl-1"
            >
              <span
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`}
                aria-hidden="true"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={event.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(event.at)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {event.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingAction?.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.confirmBody}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="tap-target">
              Go back
            </AlertDialogCancel>
            <AlertDialogAction
              className="tap-target"
              onClick={() => pendingAction && runAction(pendingAction)}
            >
              {pendingAction?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/orders/$id",
  component: OrderDetailScreen,
});
