import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Specific, human error copy with a recovery action — never a bare
 *  "Something went wrong". */
export function ErrorState({
  error,
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-10 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <p className="max-w-sm text-sm text-foreground">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="tap-target">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
