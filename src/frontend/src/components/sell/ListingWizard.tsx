import {
  type AttributeField,
  AttributeFieldType,
  ImageQualityFlag,
  type Listing,
  type ListingImage,
  type ListingInput,
  ListingStatus,
} from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateListing,
  useSubmitListingForPublish,
  useUpdateListing,
} from "@/lib/backend";
import { errorMessage, kycGateFromError } from "@/lib/errors";
import { processListingImage } from "@/lib/imageQuality";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const STEPS = [
  "Category",
  "Details",
  "Photos",
  "Specifics",
  "Location",
  "Review",
] as const;
const UNITS = ["kg", "quintal", "tonne", "dozen", "litre", "bag", "piece"];

interface WizardState {
  categoryId: bigint | null;
  title: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  images: ListingImage[];
  attributes: Record<string, string>;
  location: string;
}

function initialState(existing?: Listing): WizardState {
  return {
    categoryId: existing?.categoryId ?? null,
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    price: existing ? existing.priceInr.toString() : "",
    quantity: existing ? existing.quantity.toString() : "",
    unit: existing?.unit ?? "kg",
    images: existing?.images ?? [],
    attributes: Object.fromEntries(existing?.attributes ?? []),
    location: existing?.location ?? "",
  };
}

/** Renders one dynamic field from Category.attributeSchema. Fields are never
 *  hardcoded per category — new categories need zero frontend changes. */
function DynamicField({
  field,
  value,
  onChange,
}: {
  field: AttributeField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `attr-${field.key}`;
  const label = (
    <Label htmlFor={id}>
      {field.fieldLabel}
      {field.unit ? ` (${field.unit})` : ""}
      {field.required && (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
  switch (field.fieldType) {
    case AttributeFieldType.SELECT:
      return (
        <div className="space-y-2">
          {label}
          <Select value={value || undefined} onValueChange={onChange}>
            <SelectTrigger id={id} aria-required={field.required}>
              <SelectValue
                placeholder={`Choose ${field.fieldLabel.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case AttributeFieldType.NUMBER:
      return (
        <div className="space-y-2">
          {label}
          <Input
            id={id}
            type="number"
            inputMode="decimal"
            step="any"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              field.unit ? `e.g. 10.5 ${field.unit}` : "Enter a number"
            }
          />
        </div>
      );
    case AttributeFieldType.DATE:
      return (
        <div className="space-y-2">
          {label}
          <Input
            id={id}
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          {label}
          <Input
            id={id}
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.fieldLabel}
          />
        </div>
      );
  }
}

export function ListingWizard({ existing }: { existing?: Listing }) {
  const navigate = useNavigate();
  const categories = useCategories();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const submitForPublish = useSubmitListingForPublish();

  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(() => initialState(existing));
  const [processingImage, setProcessingImage] = useState(false);
  const [outcome, setOutcome] = useState<null | {
    kind: "published" | "review" | "draft-kyc";
    message: string;
  }>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const patch = (p: Partial<WizardState>) => setState((s) => ({ ...s, ...p }));
  const category = (categories.data ?? []).find(
    (c) => c.id === state.categoryId,
  );
  const schema = category?.attributeSchema ?? [];

  const stepValid = (): string | null => {
    switch (step) {
      case 0:
        return state.categoryId === null
          ? "Pick a category to continue."
          : null;
      case 1: {
        if (state.title.trim() === "") return "Add a title for your listing.";
        if (!(Number(state.price) > 0)) return "Set a price greater than zero.";
        if (!(Number(state.quantity) > 0)) return "Set the available quantity.";
        return null;
      }
      case 2:
        return state.images.length === 0
          ? "Add at least one photo of your produce."
          : null;
      case 3: {
        for (const field of schema) {
          const value = (state.attributes[field.key] ?? "").trim();
          if (field.required && value === "")
            return `"${field.fieldLabel}" is required for this category.`;
          if (
            value !== "" &&
            field.fieldType === AttributeFieldType.NUMBER &&
            Number.isNaN(Number(value))
          ) {
            return `"${field.fieldLabel}" must be a number.`;
          }
        }
        return null;
      }
      case 4:
        return state.location.trim() === ""
          ? "Add a pickup/dispatch location."
          : null;
      default:
        return null;
    }
  };

  const next = () => {
    const error = stepValid();
    if (error) {
      toast.error(error);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const addImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessingImage(true);
    try {
      for (const file of Array.from(files).slice(0, 5 - state.images.length)) {
        // Async image-quality check: flags blur/low-res but never blocks.
        const processed = await processListingImage(file);
        setState((s) => ({
          ...s,
          images: [
            ...s.images,
            {
              url: processed.dataUrl,
              order: BigInt(s.images.length),
              qualityFlag: processed.qualityFlag,
            },
          ],
        }));
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setProcessingImage(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setState((s) => ({
      ...s,
      images: s.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: BigInt(i) })),
    }));
  };

  const buildInput = (): ListingInput => ({
    categoryId: state.categoryId ?? 0n,
    title: state.title.trim(),
    description: state.description.trim(),
    priceInr: BigInt(Math.round(Number(state.price))),
    quantity: BigInt(Math.round(Number(state.quantity))),
    unit: state.unit,
    attributes: schema
      .map(
        (field) =>
          [field.key, (state.attributes[field.key] ?? "").trim()] as [
            string,
            string,
          ],
      )
      .filter(([, value]) => value !== ""),
    location: state.location.trim(),
    images: state.images,
  });

  const saveListing = async (): Promise<Listing> => {
    const input = buildInput();
    if (existing) {
      return updateListing.mutateAsync({ listingId: existing.id, input });
    }
    return createListing.mutateAsync(input);
  };

  const handleSaveDraft = async () => {
    try {
      await saveListing();
      toast.success("Draft saved. Publish it any time from your listings.");
      navigate({ to: "/sell" });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handlePublish = async () => {
    try {
      const listing = await saveListing();
      try {
        const published = await submitForPublish.mutateAsync(listing.id);
        setOutcome(
          published.status === ListingStatus.PUBLISHED
            ? {
                kind: "published",
                message: "Your listing is live for buyers across India.",
              }
            : {
                kind: "review",
                message:
                  "Your listing is with our moderation team and will go live once approved (usually within a few hours).",
              },
        );
      } catch (error) {
        const gate = kycGateFromError(error);
        if (gate) {
          // Draft is preserved — KYC only gates the publish, never drafting.
          setOutcome({ kind: "draft-kyc", message: gate.info.message });
          return;
        }
        toast.error(errorMessage(error));
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const busy =
    createListing.isPending ||
    updateListing.isPending ||
    submitForPublish.isPending;

  if (outcome) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
        {outcome.kind === "draft-kyc" ? (
          <ShieldCheck className="h-14 w-14 text-primary" aria-hidden="true" />
        ) : (
          <Check
            className="h-14 w-14 rounded-full bg-success/15 p-3 text-success"
            aria-hidden="true"
          />
        )}
        <h1 className="font-display text-xl font-bold">
          {outcome.kind === "published"
            ? "Listing published!"
            : outcome.kind === "review"
              ? "Submitted for review"
              : "Saved as draft — verification needed"}
        </h1>
        <p className="text-sm text-muted-foreground">{outcome.message}</p>
        {outcome.kind === "draft-kyc" ? (
          <>
            <Button
              onClick={() => navigate({ to: "/kyc" })}
              className="w-full tap-target"
            >
              Complete verification to publish
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/sell" })}
              className="w-full tap-target"
            >
              Back to my listings
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate({ to: "/sell" })}
            className="w-full tap-target"
          >
            Back to my listings
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            step === 0 ? navigate({ to: "/sell" }) : setStep((s) => s - 1)
          }
          className="tap-target inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />{" "}
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <span className="text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </span>
      </div>

      {/* Visual progress only — the "Step x of y" text above announces it */}
      <div className="flex gap-1" aria-hidden="true">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= step ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <fieldset className="space-y-2">
          <legend className="font-display text-lg font-bold">
            What are you selling?
          </legend>
          <div className="grid gap-2 pt-2">
            {categories.isPending && (
              <p className="text-sm text-muted-foreground">
                Loading categories…
              </p>
            )}
            {(categories.data ?? []).map((c) => (
              <button
                key={c.id.toString()}
                type="button"
                onClick={() =>
                  patch({
                    categoryId: c.id,
                    attributes:
                      c.id === state.categoryId ? state.attributes : {},
                  })
                }
                aria-pressed={state.categoryId === c.id}
                className={cn(
                  "tap-target rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                  state.categoryId === c.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h1 className="font-display text-lg font-bold">Core details</h1>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={state.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="e.g. Fresh Nashik Tomatoes (Grade A)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={state.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Grade, packaging, minimum order, delivery notes…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ per unit)</Label>
              <Input
                id="price"
                type="number"
                inputMode="numeric"
                min="1"
                required
                value={state.price}
                onChange={(e) => patch({ price: e.target.value })}
                placeholder="28"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity available</Label>
              <Input
                id="quantity"
                type="number"
                inputMode="numeric"
                min="1"
                required
                value={state.quantity}
                onChange={(e) => patch({ quantity: e.target.value })}
                placeholder="400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={state.unit}
              onValueChange={(unit) => patch({ unit })}
            >
              <SelectTrigger id="unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-lg font-bold">Photos</h1>
            <p className="text-sm text-muted-foreground">
              At least 1 photo, up to 5. Clear photos sell up to 3× faster.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {state.images.map((image, index) => (
              <div
                key={image.url.slice(-32)}
                className="relative aspect-square overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={image.url}
                  alt={`Listing upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-background/85 p-1.5 text-foreground backdrop-blur hover:bg-background"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {image.qualityFlag !== undefined && (
                  <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-warning/90 px-1.5 py-1 text-[10px] font-medium text-background">
                    <AlertTriangle
                      className="h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                    {image.qualityFlag === ImageQualityFlag.BLURRY
                      ? "Looks blurry — replace it?"
                      : "Low resolution — replace it?"}
                  </span>
                )}
              </div>
            ))}
            {state.images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={processingImage}
                className="tap-target flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {processingImage ? (
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Camera className="h-5 w-5" aria-hidden="true" />
                )}
                {processingImage ? "Checking…" : "Add photo"}
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addImages(e.target.files)}
            aria-label="Upload listing photos"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-lg font-bold">
              {category?.name ?? "Category"} specifics
            </h1>
            <p className="text-sm text-muted-foreground">
              Buyers filter on these details.
            </p>
          </div>
          {schema.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No extra details needed for this category.
            </p>
          ) : (
            schema.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={state.attributes[field.key] ?? ""}
                onChange={(value) =>
                  patch({
                    attributes: { ...state.attributes, [field.key]: value },
                  })
                }
              />
            ))
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h1 className="font-display text-lg font-bold">
            Pickup / dispatch location
          </h1>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              required
              value={state.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="Village/Town, District, State"
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h1 className="font-display text-lg font-bold">
            Review your listing
          </h1>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {state.images[0] && (
              <img
                src={state.images[0].url}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
            )}
            <div className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {category?.name}
              </p>
              <p className="font-display font-semibold">{state.title}</p>
              <p className="font-mono text-lg font-bold text-primary">
                ₹{Number(state.price).toLocaleString("en-IN")}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  / {state.unit}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {state.quantity} {state.unit} · {state.location}
              </p>
              {schema.map((field) => {
                const value = state.attributes[field.key];
                return value ? (
                  <p key={field.key} className="text-sm text-muted-foreground">
                    {field.fieldLabel}: {value}
                    {field.unit ?? ""}
                  </p>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {step < STEPS.length - 1 ? (
          <Button onClick={next} className="tap-target flex-1">
            Continue{" "}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={busy}
              className="tap-target flex-1"
            >
              Save as draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={busy}
              className="tap-target flex-1"
            >
              {busy && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Publish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
