import {
  KycDocStatus,
  KycDocType,
  type KycQueueRow,
  KycRejectionReason,
  UserRole,
} from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { PriorityBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminKycQueue,
  useAdminReviewKyc,
  useAdminStartKycReview,
} from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import { createRoute } from "@tanstack/react-router";
import { Check, Eye, Loader2, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as adminRoute } from "./admin";

const DOC_LABELS: Record<KycDocType, string> = {
  [KycDocType.AADHAAR]: "Aadhaar",
  [KycDocType.PAN]: "PAN",
  [KycDocType.GST]: "GST",
};

// The fixed rejection reason set — the reviewer must pick one; there is no
// generic "verification failed" option.
const REJECTION_REASONS: { value: KycRejectionReason; label: string }[] = [
  { value: KycRejectionReason.BLURRY_DOCUMENT, label: "Blurry document" },
  { value: KycRejectionReason.NAME_MISMATCH, label: "Name mismatch" },
  { value: KycRejectionReason.SELFIE_MISMATCH, label: "Selfie mismatch" },
  { value: KycRejectionReason.EXPIRED_DOCUMENT, label: "Expired document" },
  {
    value: KycRejectionReason.FRAUD_SUSPECTED,
    label: "Fraud suspected (hard block)",
  },
];

function QueueRow({ row }: { row: KycQueueRow }) {
  const review = useAdminReviewKyc();
  const startReview = useAdminStartKycReview();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<KycRejectionReason | "">("");

  const doc = row.document;
  const confidence = doc.confidenceScore;

  const approve = () => {
    review.mutate(
      { documentId: doc.id, decision: { __kind__: "Approve", Approve: null } },
      {
        onSuccess: () => toast.success(`${row.applicantName} approved.`),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  const reject = () => {
    if (rejectReason === "") {
      toast.error("Pick a rejection reason from the fixed set first.");
      return;
    }
    review.mutate(
      {
        documentId: doc.id,
        decision: { __kind__: "Reject", Reject: rejectReason },
      },
      {
        onSuccess: () =>
          toast.success(`${row.applicantName} rejected (${rejectReason}).`),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{row.applicantName}</p>
          <p className="text-xs text-muted-foreground">
            +91 {row.applicantPhone} ·{" "}
            {row.applicantRoles
              .map((r) => (r === UserRole.SELLER ? "Seller" : "Buyer"))
              .join(" + ") || "No role"}{" "}
            · {DOC_LABELS[doc.docType]} · attempt #
            {doc.attemptNumber.toString()} · submitted{" "}
            {timeAgo(doc.submittedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Priority is DERIVED from the confidence band — shown with the
              raw numeric score inline, never hidden behind a click. */}
          <PriorityBadge priority={row.priority} />
          <span
            className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs"
            title="Provider confidence score"
          >
            {confidence !== undefined ? confidence.toFixed(2) : "—"}
          </span>
          {doc.status === KycDocStatus.IN_REVIEW && (
            <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-xs text-warning">
              In review
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="tap-target"
        >
          <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" /> View documents
        </Button>
        {doc.status === KycDocStatus.PENDING && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              startReview.mutate(doc.id, {
                onError: (error) => toast.error(errorMessage(error)),
              })
            }
            disabled={startReview.isPending}
            className="tap-target"
          >
            Start review
          </Button>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select
            value={rejectReason}
            onValueChange={(v) => setRejectReason(v as KycRejectionReason)}
          >
            <SelectTrigger
              className="h-9 w-52 text-xs"
              aria-label="Rejection reason"
            >
              <SelectValue placeholder="Rejection reason…" />
            </SelectTrigger>
            <SelectContent>
              {REJECTION_REASONS.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            size="sm"
            onClick={reject}
            disabled={review.isPending || rejectReason === ""}
            className="tap-target"
          >
            {review.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <X className="mr-1 h-4 w-4" aria-hidden="true" />
            )}
            Reject
          </Button>
          <Button
            size="sm"
            onClick={approve}
            disabled={review.isPending}
            className="tap-target"
          >
            {review.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="mr-1 h-4 w-4" aria-hidden="true" />
            )}
            Approve
          </Button>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {row.applicantName} — {DOC_LABELS[doc.docType]}
            </DialogTitle>
            <DialogDescription>
              Attempt #{doc.attemptNumber.toString()} · confidence{" "}
              {confidence !== undefined ? confidence.toFixed(2) : "n/a"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <figure>
              <figcaption className="mb-1 text-xs font-medium text-muted-foreground">
                Document
              </figcaption>
              {doc.fileUrl.startsWith("data:") ? (
                <img
                  src={doc.fileUrl}
                  alt="Submitted document"
                  className="max-h-72 w-full rounded-lg border border-border object-contain"
                />
              ) : (
                <p className="rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs">
                  {doc.fileUrl}
                </p>
              )}
            </figure>
            {doc.selfieUrl !== undefined && (
              <figure>
                <figcaption className="mb-1 text-xs font-medium text-muted-foreground">
                  Selfie
                </figcaption>
                {doc.selfieUrl.startsWith("data:") ? (
                  <img
                    src={doc.selfieUrl}
                    alt="Submitted selfie"
                    className="max-h-52 w-full rounded-lg border border-border object-contain"
                  />
                ) : (
                  <p className="rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs">
                    {doc.selfieUrl}
                  </p>
                )}
              </figure>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminKycScreen() {
  const queue = useAdminKycQueue();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">KYC review queue</h1>
        <p className="text-sm text-muted-foreground">
          Latest submission per applicant and document type, oldest first. One
          row = one reviewable case.
        </p>
      </div>
      {queue.isPending ? (
        <ListSkeleton rows={3} />
      ) : queue.isError ? (
        <ErrorState error={queue.error} onRetry={() => queue.refetch()} />
      ) : queue.data.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Queue is clear"
          description="No KYC submissions are waiting for manual review. Gray-zone confidence scores land here automatically."
          actionLabel="Refresh"
          onAction={() => queue.refetch()}
        />
      ) : (
        <div className="space-y-3">
          {queue.data.map((row) => (
            <QueueRow key={row.document.id.toString()} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => adminRoute,
  path: "/kyc",
  component: AdminKycScreen,
});
