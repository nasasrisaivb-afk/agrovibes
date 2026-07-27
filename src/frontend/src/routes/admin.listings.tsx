import type { ModerationRow } from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { KycStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAdminListingQueue, useAdminModerateListing } from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { formatInr, timeAgo } from "@/lib/format";
import { createRoute } from "@tanstack/react-router";
import {
  Check,
  ClipboardList,
  Loader2,
  MessageSquareWarning,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as adminRoute } from "./admin";

function ModerationCard({ row }: { row: ModerationRow }) {
  const moderate = useAdminModerateListing();
  const [noteDialog, setNoteDialog] = useState<null | "reject" | "changes">(
    null,
  );
  const [note, setNote] = useState("");

  const listing = row.listing;

  const act = (
    action: Parameters<typeof moderate.mutate>[0]["action"],
    message: string,
  ) => {
    moderate.mutate(
      { listingId: listing.id, action },
      {
        onSuccess: () => toast.success(message),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
    setNoteDialog(null);
    setNote("");
  };

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
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
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">{listing.title}</p>
          <span className="font-mono text-sm font-semibold text-primary">
            {formatInr(listing.priceInr)} / {listing.unit}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {row.categoryName} ·{" "}
          {Number(listing.quantity).toLocaleString("en-IN")} {listing.unit} ·{" "}
          {listing.location} · submitted {timeAgo(listing.updatedAt)}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {listing.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span>Seller: {row.sellerName}</span>
          <KycStatusBadge status={row.sellerKycStatus} />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            onClick={() =>
              act(
                { __kind__: "Approve", Approve: null },
                "Listing approved and published.",
              )
            }
            disabled={moderate.isPending}
            className="tap-target"
          >
            {moderate.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="mr-1 h-4 w-4" aria-hidden="true" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setNoteDialog("changes")}
            disabled={moderate.isPending}
            className="tap-target"
          >
            <MessageSquareWarning className="mr-1 h-4 w-4" aria-hidden="true" />{" "}
            Request changes
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setNoteDialog("reject")}
            disabled={moderate.isPending}
            className="tap-target"
          >
            <X className="mr-1 h-4 w-4" aria-hidden="true" /> Reject
          </Button>
        </div>
      </div>

      <Dialog
        open={noteDialog !== null}
        onOpenChange={(open) => !open && setNoteDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {noteDialog === "reject" ? "Reject listing" : "Request changes"}
            </DialogTitle>
            <DialogDescription>
              The note is sent to the seller — be specific so they can fix the
              problem.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              noteDialog === "reject"
                ? "Why is this listing rejected?"
                : "What needs to change before it can go live?"
            }
            aria-label="Moderation note"
          />
          <DialogFooter>
            <Button
              className="tap-target w-full"
              variant={noteDialog === "reject" ? "destructive" : "default"}
              disabled={note.trim() === ""}
              onClick={() =>
                noteDialog === "reject"
                  ? act(
                      { __kind__: "Reject", Reject: note.trim() },
                      "Listing rejected — the seller has been notified.",
                    )
                  : act(
                      {
                        __kind__: "RequestChanges",
                        RequestChanges: note.trim(),
                      },
                      "Changes requested — sent back to the seller as a draft.",
                    )
              }
            >
              {noteDialog === "reject"
                ? "Reject listing"
                : "Send back for changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminListingsScreen() {
  const queue = useAdminListingQueue();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Listing moderation</h1>
        <p className="text-sm text-muted-foreground">
          Listings pending review, oldest first.
        </p>
      </div>
      {queue.isPending ? (
        <ListSkeleton rows={3} />
      ) : queue.isError ? (
        <ErrorState error={queue.error} onRetry={() => queue.refetch()} />
      ) : queue.data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing to moderate"
          description="Listings from verified sellers with prior rejections land here before going live."
          actionLabel="Refresh"
          onAction={() => queue.refetch()}
        />
      ) : (
        <div className="space-y-3">
          {queue.data.map((row) => (
            <ModerationCard key={row.listing.id.toString()} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => adminRoute,
  path: "/listings",
  component: AdminListingsScreen,
});
