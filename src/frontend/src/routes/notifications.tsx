import type { Notification } from "@/backend";
import { NotificationType } from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/lib/backend";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Landmark,
  Package,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Route as appLayoutRoute } from "./app-layout";

const ICONS: Record<NotificationType, typeof Bell> = {
  [NotificationType.ORDER_UPDATE]: Package,
  [NotificationType.KYC_UPDATE]: ShieldCheck,
  [NotificationType.PAYOUT_UPDATE]: Landmark,
  [NotificationType.LISTING_UPDATE]: Sprout,
  [NotificationType.SYSTEM]: Bell,
};

function NotificationsScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const notifications = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  if (!isAuthenticated && !isLoading) {
    return (
      <EmptyState
        icon={Bell}
        title="Sign in to see notifications"
        description="Order updates, verification results and payout alerts land here."
        actionLabel="Sign in"
        onAction={() => navigate({ to: "/auth", search: {} })}
      />
    );
  }

  const open = (notification: Notification) => {
    if (!notification.read) markRead.mutate(notification.id);
    const { orderId, listingId, kycDocumentId, payoutId } =
      notification.payload;
    if (orderId !== undefined)
      navigate({ to: "/orders/$id", params: { id: orderId.toString() } });
    else if (kycDocumentId !== undefined) navigate({ to: "/kyc" });
    else if (payoutId !== undefined) navigate({ to: "/profile", search: {} });
    else if (listingId !== undefined) navigate({ to: "/sell" });
  };

  const data = notifications.data ?? [];
  const hasUnread = data.some((n) => !n.read);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Notifications</h1>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="tap-target"
          >
            <CheckCheck className="mr-1.5 h-4 w-4" aria-hidden="true" /> Mark
            all read
          </Button>
        )}
      </div>

      {notifications.isPending || isLoading ? (
        <ListSkeleton rows={4} />
      ) : notifications.isError ? (
        <ErrorState
          error={notifications.error}
          onRetry={() => notifications.refetch()}
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nothing here yet"
          description="Order updates, verification results and payout alerts will show up here."
          actionLabel="Browse the marketplace"
          onAction={() => navigate({ to: "/" })}
        />
      ) : (
        <div className="space-y-2">
          {data.map((notification) => {
            const Icon = ICONS[notification.notificationType];
            return (
              <button
                key={notification.id.toString()}
                type="button"
                onClick={() => open(notification)}
                className={cn(
                  "tap-target flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  notification.read
                    ? "border-border bg-card/50 text-muted-foreground"
                    : "border-primary/25 bg-card hover:border-primary/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    notification.read ? "bg-muted" : "bg-primary/15",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      notification.read
                        ? "text-muted-foreground"
                        : "text-primary",
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        !notification.read && "font-semibold text-foreground",
                      )}
                    >
                      {notification.title}
                    </p>
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed">
                    {notification.body}
                  </p>
                </div>
                {!notification.read && (
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/notifications",
  component: NotificationsScreen,
});
