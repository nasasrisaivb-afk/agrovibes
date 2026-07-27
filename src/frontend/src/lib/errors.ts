import type { ApiError, KycGateInfo } from "../backend";

/** Error thrown by backend hooks, carrying the structured ApiError payload. */
export class BackendError extends Error {
  readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiErrorMessage(apiError));
    this.name = "BackendError";
    this.apiError = apiError;
  }
}

type ResultLike<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: ApiError };

/** Unwraps a canister Result, throwing BackendError on the err branch. */
export function unwrap<T>(result: ResultLike<T>): T {
  if (result.__kind__ === "ok") return result.ok;
  throw new BackendError(result.err);
}

/** Specific, human error copy per error kind — never a generic string. */
export function apiErrorMessage(error: ApiError): string {
  switch (error.__kind__) {
    case "InvalidInput":
      return error.InvalidInput;
    case "NotFound":
      return error.NotFound;
    case "Unauthorized":
      return error.Unauthorized;
    case "Forbidden":
      return error.Forbidden;
    case "Conflict":
      return error.Conflict;
    case "ProviderUnavailable":
      return error.ProviderUnavailable;
    case "RateLimited":
      return error.RateLimited.message;
    case "InvalidTransition":
      return error.InvalidTransition.message;
    case "KycRequired":
      return error.KycRequired.message;
    case "KycInProgress":
      return error.KycInProgress.message;
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof BackendError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "The request could not be completed. Check your connection and try again.";
}

/** Returns the structured KYC gate payload when the error should open the
 *  KYC flow modal (KycRequired) or the in-progress notice (KycInProgress). */
export function kycGateFromError(
  error: unknown,
): { kind: "required" | "inProgress"; info: KycGateInfo } | null {
  if (!(error instanceof BackendError)) return null;
  if (error.apiError.__kind__ === "KycRequired") {
    return { kind: "required", info: error.apiError.KycRequired };
  }
  if (error.apiError.__kind__ === "KycInProgress") {
    return { kind: "inProgress", info: error.apiError.KycInProgress };
  }
  return null;
}
