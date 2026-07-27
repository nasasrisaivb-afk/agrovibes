import type { KycGateInfo } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { Clock, ShieldCheck } from "lucide-react";

export interface KycGateState {
  kind: "required" | "inProgress";
  info: KycGateInfo;
}

interface KycGateDialogProps {
  gate: KycGateState | null;
  onClose: () => void;
}

/** Opened by the structured 403 payload from KYC-gated actions — a modal
 *  with a direct path into the KYC flow, never a generic error page. */
export function KycGateDialog({ gate, onClose }: KycGateDialogProps) {
  const navigate = useNavigate();
  if (!gate) return null;
  const inProgress = gate.kind === "inProgress";
  const fraudBlocked = !inProgress && !gate.info.canResubmit;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            {inProgress ? (
              <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
            ) : (
              <ShieldCheck
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />
            )}
          </div>
          <DialogTitle className="text-center">
            {inProgress
              ? "Verification in progress"
              : fraudBlocked
                ? "Verification blocked"
                : "Verify your identity"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {gate.info.message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {inProgress ? (
            <Button onClick={onClose} className="w-full tap-target">
              Got it
            </Button>
          ) : fraudBlocked ? (
            <Button
              onClick={() => {
                onClose();
                navigate({ to: "/profile", search: { section: "support" } });
              }}
              className="w-full tap-target"
            >
              Contact support
            </Button>
          ) : (
            <Button
              onClick={() => {
                onClose();
                navigate({ to: "/kyc" });
              }}
              className="w-full tap-target"
            >
              Start verification
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full tap-target"
          >
            Not now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
