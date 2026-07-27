import { BusinessType, Environment } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  useCategories,
  useCompleteOnboarding,
  usePublicConfig,
  useSendOtp,
  useVerifyOtp,
} from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import {
  EMPTY_DRAFT,
  type OnboardingDraft,
  clearDraft,
  loadDraft,
  saveDraft,
} from "@/lib/onboardingDraft";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  ShoppingBasket,
  Sprout,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Route as appLayoutRoute } from "./app-layout";

type Step = "phone" | "otp" | "role" | "profile";

interface AuthSearch {
  addRole?: "BUYER" | "SELLER";
}

function AuthScreen() {
  const navigate = useNavigate();
  const { addRole } = Route.useSearch();
  const { login, isAuthenticated, needsOnboarding, user, token } = useAuth();
  const publicConfig = usePublicConfig();
  const categories = useCategories();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const completeOnboarding = useCompleteOnboarding();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);
  const bootstrapped = useRef(false);

  // Resume: an authenticated user who never finished onboarding (or is
  // adding a second role) drops straight into the right step.
  useEffect(() => {
    if (bootstrapped.current) return;
    if (isAuthenticated && addRole && user) {
      bootstrapped.current = true;
      setDraft({ ...loadDraft(user.phone), role: addRole, step: "profile" });
      setPhone(user.phone);
      setStep("profile");
      return;
    }
    if (token && needsOnboarding && user) {
      bootstrapped.current = true;
      const resumed = loadDraft(user.phone);
      setPhone(user.phone);
      setDraft(resumed);
      setStep(resumed.role ? resumed.step : "role");
      return;
    }
    if (isAuthenticated && !needsOnboarding && !addRole) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, needsOnboarding, addRole, user, token, navigate]);

  // Persist the onboarding draft on every change, keyed by phone, so a
  // network drop resumes exactly where the user left off.
  const patchDraft = (patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (phone) saveDraft(phone, next);
      return next;
    });
  };

  useEffect(() => {
    if (resendIn <= 0) return;
    const handle = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(handle);
  }, [resendIn]);

  const isDev = publicConfig.data?.environment === Environment.Development;

  const handleSendOtp = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendOtp.mutate(phone, {
      onSuccess: (result) => {
        setRequestId(result.requestId);
        setOtp("");
        setResendIn(30);
        setStep("otp");
      },
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp.mutate(
      { phone, otp, requestId },
      {
        onSuccess: (result) => {
          login(result.sessionToken);
          if (!result.isNewUser) {
            // Duplicate-number handling: existing account is never
            // duplicated — sign in and say so.
            toast.info("This number is already registered — signed you in.");
            clearDraft(phone);
            navigate({ to: "/" });
            return;
          }
          const resumed = loadDraft(phone);
          setDraft(resumed);
          setStep(resumed.role ? resumed.step : "role");
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.role) return;
    const profile =
      draft.role === "BUYER"
        ? ({
            __kind__: "Buyer",
            Buyer: {
              name: draft.name.trim(),
              deliveryLocation: draft.deliveryLocation.trim(),
            },
          } as const)
        : ({
            __kind__: "Seller",
            Seller: {
              name: draft.name.trim(),
              businessType:
                draft.businessType === "REGISTERED"
                  ? BusinessType.REGISTERED
                  : BusinessType.INDIVIDUAL,
              primaryCategoryId: BigInt(draft.primaryCategoryId ?? "0"),
            },
          } as const);
    completeOnboarding.mutate(profile, {
      onSuccess: () => {
        clearDraft(phone);
        toast.success(
          draft.role === "SELLER"
            ? "You're set up to sell on CropVibe!"
            : "Welcome to CropVibe!",
        );
        navigate({ to: draft.role === "SELLER" ? "/sell" : "/" });
      },
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 py-4">
      {step !== "phone" && step !== "role" && (
        <button
          type="button"
          onClick={() => setStep(step === "otp" ? "phone" : "role")}
          className="tap-target inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
      )}

      {step === "phone" && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold">
              Sign in or create account
            </h1>
            <p className="text-sm text-muted-foreground">
              We'll send a one-time code to your mobile number. No passwords.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <div className="flex gap-2">
              <span className="flex h-11 items-center rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground">
                +91
              </span>
              <div className="relative flex-1">
                <Phone
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit number"
                  className="h-11 pl-9"
                />
              </div>
            </div>
          </div>
          {isDev && (
            <p className="rounded-lg border border-trust/30 bg-trust/10 px-3 py-2 text-xs text-trust">
              Development environment: no SMS is sent. Use OTP{" "}
              <span className="font-mono font-bold">000000</span>. Try seeded
              numbers 9000000001 (buyer) or 9000000002 (verified seller).
            </p>
          )}
          <Button
            type="submit"
            disabled={sendOtp.isPending || phone.length !== 10}
            className="w-full tap-target"
          >
            {sendOtp.isPending && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Send OTP
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold">Enter the code</h1>
            <p className="text-sm text-muted-foreground">
              Sent to +91 {phone}.{" "}
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-primary underline-offset-2 hover:underline"
              >
                Change number
              </button>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">One-time code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="6-digit code"
              className="h-12 text-center font-mono text-lg tracking-[0.4em]"
            />
          </div>
          <Button
            type="submit"
            disabled={verifyOtp.isPending || otp.length !== 6}
            className="w-full tap-target"
          >
            {verifyOtp.isPending && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Verify and continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={resendIn > 0 || sendOtp.isPending}
            onClick={() => handleSendOtp()}
            className="w-full tap-target"
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
          </Button>
        </form>
      )}

      {step === "role" && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold">
              How will you use CropVibe?
            </h1>
            <p className="text-sm text-muted-foreground">
              Pick one to start — you can add the other role later.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              {
                role: "BUYER" as const,
                icon: ShoppingBasket,
                title: "I want to buy",
                body: "Source fresh produce and farm inputs directly from verified sellers.",
              },
              {
                role: "SELLER" as const,
                icon: Sprout,
                title: "I want to sell",
                body: "List your harvest, reach buyers across India and get paid to your bank.",
              },
            ].map(({ role, icon: Icon, title, body }) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  patchDraft({ role, step: "profile" });
                  setStep("profile");
                }}
                className={cn(
                  "tap-target flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                  draft.role === role
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "profile" && draft.role && (
        <form onSubmit={handleCompleteOnboarding} className="space-y-5">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold">
              {draft.role === "BUYER"
                ? "Your delivery details"
                : "Your seller profile"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Just the essentials — verification comes later, only when needed.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              required
              value={draft.name}
              onChange={(e) => patchDraft({ name: e.target.value })}
              placeholder="Full name"
            />
          </div>

          {draft.role === "BUYER" ? (
            <div className="space-y-2">
              <Label htmlFor="location">Delivery location</Label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="location"
                  required
                  value={draft.deliveryLocation}
                  onChange={(e) =>
                    patchDraft({ deliveryLocation: e.target.value })
                  }
                  placeholder="City, State"
                  className="pl-9"
                />
              </div>
            </div>
          ) : (
            <>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Business type</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "INDIVIDUAL" as const,
                      label: "Individual farmer",
                    },
                    {
                      value: "REGISTERED" as const,
                      label: "Registered business",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => patchDraft({ businessType: option.value })}
                      aria-pressed={draft.businessType === option.value}
                      className={cn(
                        "tap-target rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                        draft.businessType === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">
                  What do you mainly sell? (pick one)
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {(categories.data ?? []).map((category) => (
                    <button
                      key={category.id.toString()}
                      type="button"
                      onClick={() =>
                        patchDraft({
                          primaryCategoryId: category.id.toString(),
                        })
                      }
                      aria-pressed={
                        draft.primaryCategoryId === category.id.toString()
                      }
                      className={cn(
                        "tap-target rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                        draft.primaryCategoryId === category.id.toString()
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          <Button
            type="submit"
            disabled={
              completeOnboarding.isPending ||
              draft.name.trim() === "" ||
              (draft.role === "BUYER"
                ? draft.deliveryLocation.trim() === ""
                : draft.primaryCategoryId === null)
            }
            className="w-full tap-target"
          >
            {completeOnboarding.isPending && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Finish setup
          </Button>
        </form>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/auth",
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    addRole:
      search.addRole === "BUYER" || search.addRole === "SELLER"
        ? search.addRole
        : undefined,
  }),
  component: AuthScreen,
});
