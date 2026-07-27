import {
  BusinessType,
  Environment,
  KycDocType,
  KycRejectionReason,
  KycStatus,
} from "@/backend";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useKycState, usePublicConfig, useSubmitKyc } from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { KYC_REJECTION_COPY } from "@/lib/format";
import { processKycImage } from "@/lib/imageQuality";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Route as appLayoutRoute } from "./app-layout";

const DOC_LABELS: Record<KycDocType, string> = {
  [KycDocType.AADHAAR]: "Aadhaar card",
  [KycDocType.PAN]: "PAN card",
  [KycDocType.GST]: "GST certificate",
};

function UploadTile({
  label,
  hint,
  value,
  onPick,
  onClear,
  icon: Icon,
}: {
  label: string;
  hint: string;
  value: string | null;
  onPick: (file: File) => void;
  onClear: () => void;
  icon: typeof Camera;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={value}
            alt={`${label} preview`}
            className="max-h-44 w-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${label}`}
            className="absolute right-2 top-2 rounded-full bg-background/85 p-1.5 backdrop-blur hover:bg-background"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="tap-target flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
          <span>{hint}</span>
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture={label.toLowerCase().includes("selfie") ? "user" : undefined}
        className="hidden"
        aria-label={label}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function KycScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const kyc = useKycState();
  const publicConfig = usePublicConfig();
  const submit = useSubmitKyc();

  const [docType, setDocType] = useState<KycDocType>(KycDocType.AADHAAR);
  const [docImage, setDocImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [docName, setDocName] = useState("document.jpg");
  const [selfieName, setSelfieName] = useState("selfie.jpg");
  const [processing, setProcessing] = useState(false);

  if (!isAuthenticated && !isLoading) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Sign in to verify your identity"
        description="KYC verification unlocks publishing listings and high-value purchases."
        actionLabel="Sign in"
        onAction={() => navigate({ to: "/auth", search: {} })}
      />
    );
  }
  if (kyc.isPending || isLoading) return <ListSkeleton rows={3} />;
  if (kyc.isError)
    return <ErrorState error={kyc.error} onRetry={() => kyc.refetch()} />;

  const state = kyc.data;
  const isDev = publicConfig.data?.environment === Environment.Development;
  const registered = user?.businessType === BusinessType.REGISTERED;
  const docTypes = registered
    ? [KycDocType.AADHAAR, KycDocType.PAN, KycDocType.GST]
    : [KycDocType.AADHAAR, KycDocType.PAN];
  const selfieRequired = docType !== KycDocType.GST;
  const fraudBlocked =
    state.rejectionReason === KycRejectionReason.FRAUD_SUSPECTED;
  const rejectionCopy = state.rejectionReason
    ? KYC_REJECTION_COPY[state.rejectionReason]
    : null;

  const pickImage = async (file: File, kind: "doc" | "selfie") => {
    setProcessing(true);
    try {
      const dataUrl = await processKycImage(file);
      // In the simulated provider, the file NAME drives the outcome — carry
      // it through the URL so the dev hooks work end-to-end.
      const taggedUrl = `${dataUrl}#${encodeURIComponent(file.name)}`;
      if (kind === "doc") {
        setDocImage(taggedUrl);
        setDocName(file.name);
      } else {
        setSelfieImage(taggedUrl);
        setSelfieName(file.name);
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docImage) return;
    submit.mutate(
      { docType, fileUrl: docImage, selfieUrl: selfieImage ?? undefined },
      {
        onSuccess: (next) => {
          if (next.status === KycStatus.VERIFIED)
            toast.success("You're verified! All features are unlocked.");
          else if (next.status === KycStatus.REJECTED)
            toast.error("Verification was rejected — see the reason below.");
          else
            toast.info(
              "Documents submitted — review typically completes within 24 hours.",
            );
          setDocImage(null);
          setSelfieImage(null);
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  return (
    <div className="mx-auto max-w-md space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="tap-target inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
      </button>

      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold">
          Identity verification
        </h1>
        <p className="text-sm text-muted-foreground">
          Verification protects buyers and sellers. It unlocks publishing
          listings and purchases above the configured limit.
        </p>
      </div>

      {state.status === KycStatus.VERIFIED && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-6 py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold">You're verified</h2>
          <p className="text-sm text-muted-foreground">
            Your identity is confirmed. You can publish listings and make
            purchases of any size.
          </p>
          <Button
            onClick={() => navigate({ to: "/sell" })}
            className="tap-target"
          >
            Go to seller hub
          </Button>
        </div>
      )}

      {(state.status === KycStatus.PENDING ||
        state.status === KycStatus.IN_REVIEW) && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-6 py-8 text-center">
          <Clock className="h-12 w-12 text-warning" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold">
            Verification in progress
          </h2>
          <p className="text-sm text-muted-foreground">
            Your documents are being reviewed — typically completed within 24
            hours. We'll notify you the moment it's done. You cannot resubmit
            while a review is active.
          </p>
        </div>
      )}

      {state.status === KycStatus.REJECTED && rejectionCopy && (
        <div
          className="space-y-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-5"
          role="alert"
        >
          <h2 className="font-display text-base font-bold text-destructive">
            {rejectionCopy.title}
          </h2>
          <p className="text-sm text-foreground">{rejectionCopy.body}</p>
          {fraudBlocked && (
            <Button
              onClick={() =>
                navigate({ to: "/profile", search: { section: "support" } })
              }
              className="mt-2 w-full tap-target"
            >
              Contact support
            </Button>
          )}
        </div>
      )}

      {(state.status === KycStatus.NONE ||
        state.status === KycStatus.REJECTED) &&
        !fraudBlocked &&
        (!state.canResubmit ? (
          <div
            className="rounded-2xl border border-warning/40 bg-warning/10 p-5 text-sm"
            role="alert"
          >
            You've used all {state.maxAttempts.toString()} verification attempts
            for now ({state.attemptsUsedInWindow.toString()} in the current
            window). Please try again later or contact support from your
            profile.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Document type</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {docTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocType(type)}
                    aria-pressed={docType === type}
                    className={cn(
                      "tap-target rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      docType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {DOC_LABELS[type]}
                  </button>
                ))}
              </div>
              {registered && (
                <p className="text-xs text-muted-foreground">
                  Registered businesses can verify with their GST certificate.
                </p>
              )}
            </fieldset>

            <UploadTile
              label={`${DOC_LABELS[docType]} photo`}
              hint="Tap to upload a clear photo"
              value={docImage}
              onPick={(file) => pickImage(file, "doc")}
              onClear={() => setDocImage(null)}
              icon={FileText}
            />

            {selfieRequired && (
              <UploadTile
                label="Selfie (liveness check)"
                hint="Tap to take a selfie"
                value={selfieImage}
                onPick={(file) => pickImage(file, "selfie")}
                onClear={() => setSelfieImage(null)}
                icon={Camera}
              />
            )}

            {isDev && (
              <p className="rounded-lg border border-trust/30 bg-trust/10 px-3 py-2 text-xs text-trust">
                Dev environment — the verification provider is simulated. Name
                your file with "review" for manual review,
                "blurry"/"expired"/"mismatch"/"fraud" to force those rejections;
                anything else auto-approves. (Current files: {docName}
                {selfieRequired ? `, ${selfieName}` : ""})
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              {state.attemptsUsedInWindow.toString()} of{" "}
              {state.maxAttempts.toString()} attempts used in the current
              window.
            </p>

            <Button
              type="submit"
              disabled={
                submit.isPending ||
                processing ||
                !docImage ||
                (selfieRequired && !selfieImage)
              }
              className="w-full tap-target"
            >
              {(submit.isPending || processing) && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Submit for verification
            </Button>
          </form>
        ))}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/kyc",
  component: KycScreen,
});
