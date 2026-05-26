import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  FileUp,
  Package,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DisputeFlowModalProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

const DISPUTE_REASONS = [
  { label: "Not as described", icon: "📋" },
  { label: "Item not received", icon: "📭" },
  { label: "Quality issue", icon: "⚠️" },
  { label: "Wrong item delivered", icon: "🔄" },
  { label: "Suspected fraud", icon: "🚨" },
];

const STEPS = [
  { label: "Select Reason", icon: FileText },
  { label: "Add Evidence", icon: FileUp },
  { label: "Review", icon: Package },
];

export function DisputeFlowModal({
  orderId,
  open,
  onClose,
}: DisputeFlowModalProps) {
  const [step, setStep] = useState(0);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step === 0 && !selectedReason) {
      toast.error("Please select a dispute reason");
      return;
    }
    if (
      step === 1 &&
      description.trim().length > 0 &&
      description.trim().length < 10
    ) {
      toast.error("Please describe in at least 10 characters");
      return;
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      toast.success("Dispute submitted", {
        description: "Resolution within 48 hours. Escrow held safely.",
      });
    }, 400);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSelectedReason("");
      setDescription("");
      setFileName(null);
      setSubmitted(false);
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-sm mx-auto rounded-2xl p-0 overflow-hidden"
        data-ocid="dispute.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base font-display">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Raise a Dispute
          </DialogTitle>
        </DialogHeader>

        {/* Escrow hold banner */}
        <div className="mx-5 mt-3 flex items-center gap-2 bg-trust/5 border border-trust/20 rounded-xl px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-trust flex-shrink-0" />
          <p className="text-[11px] text-trust font-medium">
            ₹1,200 is held safely in escrow until resolved
          </p>
        </div>

        {!submitted ? (
          <>
            {/* Step indicator */}
            <div className="flex items-center px-5 pt-3 pb-1 gap-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div
                    key={s.label}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold flex-shrink-0 transition-smooth ${
                        isDone
                          ? "bg-success text-white"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-1 rounded transition-smooth ${isDone ? "bg-success" : "bg-border"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground pb-1">
              Step {step + 1} of {STEPS.length}: {STEPS[step].label}
            </p>

            {/* Step content */}
            <div className="px-5 pb-5 flex flex-col gap-4">
              {/* Step 0: Select reason */}
              {step === 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Order:{" "}
                    <span className="text-foreground font-semibold">
                      {orderId}
                    </span>
                  </p>
                  <Label className="text-sm font-medium">
                    What went wrong?
                  </Label>
                  <div className="flex flex-col gap-1.5">
                    {DISPUTE_REASONS.map((reason) => (
                      <button
                        type="button"
                        key={reason.label}
                        onClick={() => setSelectedReason(reason.label)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm text-left transition-smooth ${
                          selectedReason === reason.label
                            ? "bg-primary/10 border-primary text-primary font-medium"
                            : "border-border hover:bg-muted/50 text-foreground"
                        }`}
                        data-ocid="dispute.reason-btn"
                      >
                        <span className="text-base">{reason.icon}</span>
                        <span className="flex-1">{reason.label}</span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 flex-shrink-0 ${
                            selectedReason === reason.label
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Evidence */}
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <div>
                    <Label
                      htmlFor="dispute-desc"
                      className="text-sm font-medium mb-1 block"
                    >
                      Describe the issue
                    </Label>
                    <Textarea
                      id="dispute-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what went wrong in detail..."
                      className="min-h-[90px] resize-none text-sm"
                      data-ocid="dispute.description-input"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {description.length} chars
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    data-ocid="dispute.file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-2xl py-6 hover:bg-muted/40 transition-smooth"
                    data-ocid="dispute.upload-btn"
                  >
                    <FileUp className="h-7 w-7 text-muted-foreground/50" />
                    <p className="text-sm font-medium">
                      {fileName ?? "Upload photo evidence"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Images or videos · Optional
                    </p>
                  </button>
                  {fileName && (
                    <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-xl px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      <p className="text-xs text-success truncate">
                        {fileName}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-muted/40 rounded-xl border border-border p-3 flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Order</span>
                      <span className="font-semibold">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Reason</span>
                      <span className="font-medium text-right max-w-[60%]">
                        {selectedReason}
                      </span>
                    </div>
                    {description && (
                      <div className="flex justify-between text-xs gap-2">
                        <span className="text-muted-foreground flex-shrink-0">
                          Details
                        </span>
                        <span className="font-medium text-right line-clamp-2">
                          {description}
                        </span>
                      </div>
                    )}
                    {fileName && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Evidence</span>
                        <span className="font-medium truncate max-w-[60%]">
                          {fileName}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Our team will review your dispute within 48 hours. Escrow
                    funds are protected.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2 pt-1">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep((s) => s - 1)}
                    data-ocid="dispute.back-btn"
                  >
                    Back
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={handleNext}
                    data-ocid="dispute.next-btn"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleSubmit}
                    data-ocid="dispute.submit-btn"
                  >
                    Submit Dispute
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mt-2">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">
                Dispute Submitted!
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Resolution within <strong>48 hours</strong>.<br />
                You'll be notified of updates.
              </p>
            </div>
            <div className="w-full flex items-center gap-2 bg-trust/5 border border-trust/20 rounded-xl px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-trust flex-shrink-0" />
              <p className="text-xs text-trust font-medium text-left">
                ₹1,200 is held safely in escrow until resolved
              </p>
            </div>
            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground"
              onClick={handleClose}
              data-ocid="dispute.close-btn"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
