import {
  Environment,
  type OrderView,
  PaymentMethod,
  type PublicListing,
} from "@/backend";
import {
  KycGateDialog,
  type KycGateState,
} from "@/components/shared/KycGateDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useConfirmCheckout,
  useInitiateCheckout,
  usePublicConfig,
} from "@/lib/backend";
import { errorMessage, kycGateFromError } from "@/lib/errors";
import { formatInr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CheckoutSheetProps {
  listing: PublicListing;
  quantity: number;
  open: boolean;
  onClose: () => void;
}

const METHODS = [
  {
    value: PaymentMethod.UPI,
    label: "UPI",
    hint: "GPay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    value: PaymentMethod.CARD,
    label: "Card",
    hint: "Credit or debit",
    icon: CreditCard,
  },
  {
    value: PaymentMethod.NETBANKING,
    label: "Netbanking",
    hint: "All major banks",
    icon: Banknote,
  },
] as const;

type Phase = "review" | "success" | "failed";

export function CheckoutSheet({
  listing,
  quantity,
  open,
  onClose,
}: CheckoutSheetProps) {
  const publicConfig = usePublicConfig();
  const initiate = useInitiateCheckout();
  const confirm = useConfirmCheckout();

  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
  // Client-side idempotency key, generated once per checkout attempt and
  // reused across retries so replays can never duplicate orders/payments.
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("review");
  const [placedOrder, setPlacedOrder] = useState<OrderView | null>(null);
  const [gate, setGate] = useState<KycGateState | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIdempotencyKey(crypto.randomUUID());
      setPhase("review");
      setPlacedOrder(null);
      setPayError(null);
    }
  }, [open]);

  const total = Number(listing.priceInr) * quantity;
  const threshold = publicConfig.data
    ? Number(publicConfig.data.kycCheckoutThresholdInr)
    : null;
  const isDev = publicConfig.data?.environment === Environment.Development;
  const paying = initiate.isPending || confirm.isPending;

  const pay = async (succeed: boolean) => {
    setPayError(null);
    try {
      await initiate.mutateAsync({
        listingId: listing.id,
        quantity: BigInt(quantity),
        method,
        idempotencyKey,
      });
      const result = await confirm.mutateAsync({ idempotencyKey, succeed });
      if (result.order) {
        setPlacedOrder(result.order);
        setPhase("success");
      } else {
        setPhase("failed");
      }
    } catch (error) {
      const gateInfo = kycGateFromError(error);
      if (gateInfo) {
        setGate(gateInfo);
        return;
      }
      setPayError(errorMessage(error));
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && !paying && onClose()}>
        <SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-2xl">
          {phase === "review" && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>Confirm your order</SheetTitle>
                <SheetDescription>
                  Payment is simulated via Razorpay sandbox until live keys are
                  configured.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="line-clamp-1 text-sm font-medium">
                    {listing.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {quantity} {listing.unit} × {formatInr(listing.priceInr)}
                    </span>
                    <span className="font-mono text-lg font-bold text-primary">
                      {formatInr(total)}
                    </span>
                  </div>
                </div>

                {threshold !== null && total >= threshold && (
                  <p className="rounded-lg border border-trust/30 bg-trust/10 px-3 py-2 text-xs text-trust">
                    Orders of {formatInr(threshold)} or more require identity
                    verification (KYC).
                  </p>
                )}

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Payment method
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {METHODS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMethod(m.value)}
                        aria-pressed={method === m.value}
                        className={cn(
                          "tap-target flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition-colors",
                          method === m.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <m.icon className="h-5 w-5" aria-hidden="true" />
                        {m.label}
                        <span className="text-[10px] font-normal opacity-70">
                          {m.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {payError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {payError}
                  </p>
                )}

                <Button
                  onClick={() => pay(true)}
                  disabled={paying}
                  className="w-full tap-target text-base"
                >
                  {paying ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />{" "}
                      Processing payment…
                    </>
                  ) : (
                    <>Pay {formatInr(total)}</>
                  )}
                </Button>
                {isDev && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pay(false)}
                    disabled={paying}
                    className="w-full text-xs text-muted-foreground"
                  >
                    Dev: simulate a failed payment
                  </Button>
                )}
              </div>
            </>
          )}

          {phase === "success" && placedOrder && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2
                className="h-14 w-14 text-success"
                aria-hidden="true"
              />
              <SheetTitle>Order placed!</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Order #{placedOrder.order.id.toString()} for{" "}
                {formatInr(placedOrder.order.totalAmountInr)} is confirmed with
                the seller. Track it in your orders.
              </p>
              <Button asChild className="mt-2 w-full tap-target">
                <Link
                  to="/orders/$id"
                  params={{ id: placedOrder.order.id.toString() }}
                  onClick={onClose}
                >
                  View order
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full tap-target"
              >
                Keep browsing
              </Button>
            </div>
          )}

          {phase === "failed" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <XCircle
                className="h-14 w-14 text-destructive"
                aria-hidden="true"
              />
              <SheetTitle>Payment failed</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Your payment did not go through and you have not been charged.
                You can retry safely — the same checkout is never charged twice.
              </p>
              <Button
                onClick={() => {
                  setIdempotencyKey(crypto.randomUUID());
                  setPhase("review");
                }}
                className="mt-2 w-full tap-target"
              >
                Try again
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full tap-target"
              >
                Cancel
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <KycGateDialog gate={gate} onClose={() => setGate(null)} />
    </>
  );
}
