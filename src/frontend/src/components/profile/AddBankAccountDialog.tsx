import { BankVerificationStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddBankAccount, useLookupIfsc } from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { Landmark, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddBankAccountDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const lookup = useLookupIfsc();
  const addAccount = useAddBankAccount();

  const [ifsc, setIfsc] = useState("");
  const [bank, setBank] = useState<{ bankName: string; branch: string } | null>(
    null,
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmNumber, setConfirmNumber] = useState("");
  const [holderName, setHolderName] = useState("");

  const reset = () => {
    setIfsc("");
    setBank(null);
    setAccountNumber("");
    setConfirmNumber("");
    setHolderName("");
  };

  const handleLookup = () => {
    lookup.mutate(ifsc, {
      onSuccess: (result) => setBank(result),
      onError: (error) => {
        setBank(null);
        toast.error(errorMessage(error));
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount.mutate(
      {
        ifsc,
        accountNumber,
        confirmAccountNumber: confirmNumber,
        accountHolderName: holderName,
      },
      {
        onSuccess: (account) => {
          if (account.verificationStatus === BankVerificationStatus.VERIFIED) {
            toast.success(
              `Account ending ${account.accountNumberLast4} verified via penny drop.`,
            );
          } else {
            toast.error(
              "Penny-drop verification failed for this account. Check the number and holder name, then add it again.",
            );
          }
          reset();
          onClose();
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  const mismatch = confirmNumber.length > 0 && confirmNumber !== accountNumber;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" aria-hidden="true" /> Add
            bank account
          </DialogTitle>
          <DialogDescription>
            We verify every account with a penny-drop check before payouts can
            be sent to it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ifsc">IFSC code</Label>
            <div className="flex gap-2">
              <Input
                id="ifsc"
                required
                value={ifsc}
                onChange={(e) => {
                  setIfsc(e.target.value.toUpperCase());
                  setBank(null);
                }}
                placeholder="e.g. HDFC0000240"
                maxLength={11}
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLookup}
                disabled={ifsc.length !== 11 || lookup.isPending}
                className="tap-target shrink-0"
              >
                {lookup.isPending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  "Look up"
                )}
              </Button>
            </div>
            {/* Bank + branch resolved from the IFSC master — never free-typed */}
            {bank && (
              <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm">
                <span className="font-medium">{bank.bankName}</span>
                <span className="text-muted-foreground"> · {bank.branch}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">Account number</Label>
            <Input
              id="account-number"
              required
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18))
              }
              placeholder="9-18 digits"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-number">Re-enter account number</Label>
            <Input
              id="confirm-number"
              required
              inputMode="numeric"
              value={confirmNumber}
              onChange={(e) =>
                setConfirmNumber(e.target.value.replace(/\D/g, "").slice(0, 18))
              }
              onPaste={(e) => e.preventDefault()}
              placeholder="Type it again — paste is disabled"
              className="font-mono"
              aria-invalid={mismatch}
            />
            {mismatch && (
              <p role="alert" className="text-xs text-destructive">
                The two account numbers don't match yet.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="holder-name">Account holder name</Label>
            <Input
              id="holder-name"
              required
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="Exactly as per bank records"
            />
          </div>

          <Button
            type="submit"
            disabled={
              !bank ||
              mismatch ||
              accountNumber.length < 9 ||
              holderName.trim() === "" ||
              addAccount.isPending
            }
            className="w-full tap-target"
          >
            {addAccount.isPending && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Verify and add account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
