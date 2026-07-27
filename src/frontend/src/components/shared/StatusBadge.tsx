import {
  BankVerificationStatus,
  KycStatus,
  ListingStatus,
  OrderStatus,
  PaymentStatus,
  PayoutStatus,
  Priority,
} from "@/backend";
import { cn } from "@/lib/utils";

type Tone = "gold" | "green" | "blue" | "red" | "gray" | "orange";

const toneClasses: Record<Tone, string> = {
  gold: "bg-primary/15 text-primary border-primary/30",
  green: "bg-success/15 text-success border-success/30",
  blue: "bg-trust/15 text-trust border-trust/30",
  red: "bg-destructive/15 text-destructive border-destructive/40",
  gray: "bg-muted text-muted-foreground border-border",
  orange: "bg-warning/15 text-warning border-warning/30",
};

function Pill({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { tone: Tone; label: string }> = {
    [OrderStatus.PLACED]: { tone: "gold", label: "Placed" },
    [OrderStatus.CONFIRMED]: { tone: "blue", label: "Confirmed" },
    [OrderStatus.IN_PROGRESS]: { tone: "orange", label: "In progress" },
    [OrderStatus.COMPLETED]: { tone: "green", label: "Completed" },
    [OrderStatus.CANCELLED]: { tone: "gray", label: "Cancelled" },
    [OrderStatus.DISPUTED]: { tone: "red", label: "Disputed" },
    [OrderStatus.RESOLVED]: { tone: "blue", label: "Resolved" },
  };
  return <Pill {...map[status]} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { tone: Tone; label: string }> = {
    [PaymentStatus.PENDING]: { tone: "orange", label: "Payment pending" },
    [PaymentStatus.PAID]: { tone: "green", label: "Paid" },
    [PaymentStatus.REFUNDED]: { tone: "blue", label: "Refunded" },
    [PaymentStatus.FAILED]: { tone: "red", label: "Payment failed" },
  };
  return <Pill {...map[status]} />;
}

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const map: Record<ListingStatus, { tone: Tone; label: string }> = {
    [ListingStatus.DRAFT]: { tone: "gray", label: "Draft" },
    [ListingStatus.PENDING_REVIEW]: { tone: "orange", label: "In review" },
    [ListingStatus.PUBLISHED]: { tone: "green", label: "Live" },
    [ListingStatus.PAUSED]: { tone: "gray", label: "Paused" },
    [ListingStatus.SOLD_OUT]: { tone: "gold", label: "Sold out" },
    [ListingStatus.ARCHIVED]: { tone: "gray", label: "Archived" },
    [ListingStatus.REJECTED]: { tone: "red", label: "Rejected" },
  };
  return <Pill {...map[status]} />;
}

export function KycStatusBadge({ status }: { status: KycStatus }) {
  const map: Record<KycStatus, { tone: Tone; label: string }> = {
    [KycStatus.NONE]: { tone: "gray", label: "Not verified" },
    [KycStatus.PENDING]: { tone: "orange", label: "Verification pending" },
    [KycStatus.IN_REVIEW]: { tone: "orange", label: "In review" },
    [KycStatus.VERIFIED]: { tone: "green", label: "KYC verified" },
    [KycStatus.REJECTED]: { tone: "red", label: "Verification rejected" },
  };
  return <Pill {...map[status]} />;
}

export function BankStatusBadge({
  status,
}: { status: BankVerificationStatus }) {
  const map: Record<BankVerificationStatus, { tone: Tone; label: string }> = {
    [BankVerificationStatus.UNVERIFIED]: { tone: "gray", label: "Unverified" },
    [BankVerificationStatus.PENNY_DROP_PENDING]: {
      tone: "orange",
      label: "Verifying",
    },
    [BankVerificationStatus.VERIFIED]: { tone: "green", label: "Verified" },
    [BankVerificationStatus.FAILED]: {
      tone: "red",
      label: "Verification failed",
    },
  };
  return <Pill {...map[status]} />;
}

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const map: Record<PayoutStatus, { tone: Tone; label: string }> = {
    [PayoutStatus.SCHEDULED]: { tone: "gold", label: "Scheduled" },
    [PayoutStatus.PROCESSING]: { tone: "orange", label: "Processing" },
    [PayoutStatus.PAID]: { tone: "green", label: "Paid" },
    [PayoutStatus.FAILED]: { tone: "red", label: "Failed" },
  };
  return <Pill {...map[status]} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { tone: Tone; label: string }> = {
    [Priority.HIGH]: { tone: "red", label: "High" },
    [Priority.MEDIUM]: { tone: "orange", label: "Medium" },
    [Priority.LOW]: { tone: "green", label: "Low" },
  };
  return <Pill {...map[priority]} />;
}
