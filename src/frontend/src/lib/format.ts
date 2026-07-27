import { KycRejectionReason } from "../backend";

/** Formats integer rupees with the Indian digit grouping (₹1,20,000). */
export function formatInr(amount: bigint | number): string {
  const n = typeof amount === "bigint" ? Number(amount) : amount;
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Canister timestamps are nanoseconds since epoch. */
export function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

export function formatDate(ns: bigint): string {
  return nsToDate(ns).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(ns: bigint): string {
  return nsToDate(ns).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(ns: bigint): string {
  const seconds = Math.floor((Date.now() - nsToDate(ns).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(ns);
}

export function dateToNs(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

/** Per-reason rejection copy — the fixed reason set, never a generic
 *  "verification failed" string. */
export const KYC_REJECTION_COPY: Record<
  KycRejectionReason,
  { title: string; body: string; action: string }
> = {
  [KycRejectionReason.BLURRY_DOCUMENT]: {
    title: "Document photo too blurry",
    body: "We couldn't read your document. Retake the photo in good light, hold the camera steady, and keep the full document in frame.",
    action: "Retake and resubmit",
  },
  [KycRejectionReason.NAME_MISMATCH]: {
    title: "Name doesn't match",
    body: "The name on your document doesn't match the name on your profile. Update your profile name or submit a document with the matching name.",
    action: "Resubmit with matching name",
  },
  [KycRejectionReason.SELFIE_MISMATCH]: {
    title: "Selfie didn't match",
    body: "Your selfie didn't match the photo on your document. Retake it in good light, facing the camera, without glasses or a hat.",
    action: "Retake selfie",
  },
  [KycRejectionReason.EXPIRED_DOCUMENT]: {
    title: "Document expired",
    body: "The document you submitted is past its validity date. Please submit a currently valid document.",
    action: "Submit a valid document",
  },
  [KycRejectionReason.FRAUD_SUSPECTED]: {
    title: "Verification blocked",
    body: "We couldn't verify your identity and further attempts are blocked on this account. Our support team can help you resolve this.",
    action: "Contact support",
  },
};
