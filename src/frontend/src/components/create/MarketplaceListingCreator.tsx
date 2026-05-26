import { Badge } from "@/components/ui/badge";
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
import { useCreateListing } from "@/lib/backend";
import { ProduceCategory } from "@/types";
import {
  Camera,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AIEnhancementPanel } from "./AIEnhancementPanel";
import { VoiceInputButton } from "./VoiceInputButton";

const SUBCATEGORY_MAP: Record<string, string[]> = {
  [ProduceCategory.Fruits]: [
    "Mangoes",
    "Bananas",
    "Guava",
    "Papaya",
    "Citrus",
    "Berries",
  ],
  [ProduceCategory.Vegetables]: [
    "Tomatoes",
    "Onions",
    "Potatoes",
    "Leafy Greens",
    "Gourds",
    "Chilies",
  ],
  [ProduceCategory.Grains]: [
    "Rice",
    "Wheat",
    "Maize",
    "Jowar",
    "Bajra",
    "Pulses",
  ],
  [ProduceCategory.Dairy]: ["Milk", "Curd", "Ghee", "Paneer", "Butter"],
  [ProduceCategory.Eggs]: ["Hen Eggs", "Duck Eggs", "Quail Eggs"],
  [ProduceCategory.Other]: ["Spices", "Herbs", "Organic Specialty", "Honey"],
};

const UNITS = ["kg", "quintal", "piece", "dozen", "litre", "bundle"];
const MARKET_PRICES: Record<string, number> = {
  [ProduceCategory.Fruits]: 85,
  [ProduceCategory.Vegetables]: 55,
  [ProduceCategory.Grains]: 35,
  [ProduceCategory.Dairy]: 70,
  [ProduceCategory.Eggs]: 8,
  [ProduceCategory.Other]: 50,
};

const AI_DESCRIPTION_TEMPLATES: Record<string, string> = {
  [ProduceCategory.Vegetables]:
    "Farm-fresh vegetables, harvested this morning and ready for delivery. Pesticide-free, Grade A quality. Grown using sustainable farming practices in fertile soil with optimal irrigation. Perfect for households, restaurants, and bulk buyers.",
  [ProduceCategory.Fruits]:
    "Naturally ripened, handpicked premium quality fruits. Rich in flavour and nutrition. Direct from our farm — no cold storage. Best consumed within 3-5 days of delivery.",
  [ProduceCategory.Grains]:
    "Sun-dried premium quality grains. Non-GMO, free of impurities, properly cleaned and sorted. Ideal for retail, processing units, and bulk purchases. Available in flexible quantities.",
  [ProduceCategory.Dairy]:
    "Pure and fresh dairy product from healthy, grass-fed animals. No added preservatives. Collected fresh and dispatched same day. A2 variant available on request.",
  [ProduceCategory.Eggs]:
    "Farm-fresh free-range eggs. Collected daily and delivered within 24 hours. Antibiotic-free hens, natural feed. Rich in protein and nutrition.",
  [ProduceCategory.Other]:
    "Certified organic specialty produce. Grown without chemical inputs. Available in bulk or retail packs. Certificate of organics available on request.",
};

const MOCK_FARMER_ID = BigInt(1);
const MAX_PHOTOS = 5;

interface ListingForm {
  name: string;
  description: string;
  category: ProduceCategory;
  subcategory: string;
  price: string;
  quantity: string;
  unit: string;
  margin: number;
  escrowEnabled: boolean;
  featureListing: boolean;
  boostDuration: string;
  photos: string[];
}

export function MarketplaceListingCreator() {
  const [form, setForm] = useState<ListingForm>({
    name: "",
    description: "",
    category: ProduceCategory.Vegetables,
    subcategory: "",
    price: "",
    quantity: "",
    unit: "kg",
    margin: 20,
    escrowEnabled: true,
    featureListing: false,
    boostDuration: "7",
    photos: [],
  });
  const [aiDescShown, setAiDescShown] = useState(false);
  const [success, setSuccess] = useState(false);

  const createListing = useCreateListing();

  const marketPrice = MARKET_PRICES[form.category] ?? 50;
  const costNum = Number(form.price) || 0;
  const suggestedPrice =
    costNum > 0 ? Math.round(costNum * (1 + form.margin / 100)) : 0;

  const setField = <K extends keyof ListingForm>(key: K, val: ListingForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleCategoryChange = (val: string) => {
    setField("category", val as ProduceCategory);
    setField("subcategory", "");
  };

  const handleGenerateDesc = () => {
    setField(
      "description",
      AI_DESCRIPTION_TEMPLATES[form.category] ??
        AI_DESCRIPTION_TEMPLATES[ProduceCategory.Other],
    );
    setAiDescShown(true);
    toast.success("AI description generated!");
  };

  const addPhoto = () => {
    if (form.photos.length >= MAX_PHOTOS) return;
    setField("photos", [...form.photos, `photo_${form.photos.length + 1}`]);
  };

  const removePhoto = (i: number) =>
    setField(
      "photos",
      form.photos.filter((_, idx) => idx !== i),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    try {
      await createListing.mutateAsync({
        farmerId: MOCK_FARMER_ID,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: "",
        category: form.category,
        price: suggestedPrice > 0 ? suggestedPrice : Number(form.price),
        escrowEnabled: form.escrowEnabled,
      });
      setSuccess(true);
      toast.success("Listing posted to marketplace!");
    } catch {
      toast.error("Failed to post listing.");
    }
  };

  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-10 text-center"
        data-ocid="marketplace-listing-success"
      >
        <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground">
          Listing Live!
        </h3>
        <p className="text-sm text-muted-foreground">
          Your product is now visible to buyers across India.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuccess(false)}
            data-ocid="marketplace-post-another"
          >
            Post Another
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground"
            onClick={() => {
              window.location.href = "/marketplace";
            }}
            data-ocid="marketplace-view-link"
          >
            View Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo grid */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center justify-between">
          Product Photos
          <span className="text-xs font-normal text-muted-foreground">
            {form.photos.length}/{MAX_PHOTOS}
          </span>
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {form.photos.map((photo, i) => (
            <div
              key={photo}
              className="aspect-square bg-muted rounded-xl relative flex items-center justify-center"
              data-ocid={`listing-photo.${i + 1}`}
            >
              <span className="text-2xl">🌿</span>
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label="Remove photo"
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-destructive/80 flex items-center justify-center"
                data-ocid={`listing-photo-remove.${i + 1}`}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          {form.photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={addPhoto}
              className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted/80 flex flex-col items-center justify-center gap-1 transition-smooth"
              data-ocid="listing-add-photo-btn"
              aria-label="Add photo"
            >
              <Camera className="h-5 w-5 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="mkt-name" className="text-sm font-semibold">
          Product Name <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="mkt-name"
            placeholder="e.g. Fresh Alphonso Mangoes Grade A"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="rounded-xl flex-1"
            data-ocid="marketplace-name-input"
          />
          <VoiceInputButton
            aria-label="Voice input for product name"
            onResult={(t) => setField("name", t)}
          />
        </div>
      </div>

      {/* AI Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="mkt-desc" className="text-sm font-semibold">
            Description
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleGenerateDesc}
            className="h-7 text-xs gap-1 border-accent/40 text-accent hover:bg-accent/10"
            data-ocid="marketplace-ai-desc-btn"
          >
            <Sparkles className="h-3 w-3" /> Generate Description
          </Button>
        </div>
        <Textarea
          id="mkt-desc"
          placeholder="Describe quality, harvest date, storage..."
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
          data-ocid="marketplace-desc-input"
        />
        {aiDescShown && (
          <p className="text-xs text-success flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI-generated — feel free to edit
          </p>
        )}
      </div>

      {/* Category + Subcategory */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="mkt-cat" className="text-sm font-semibold">
            Category
          </Label>
          <Select value={form.category} onValueChange={handleCategoryChange}>
            <SelectTrigger
              id="mkt-cat"
              className="rounded-xl"
              data-ocid="marketplace-category-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProduceCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mkt-subcat" className="text-sm font-semibold">
            Sub-category
          </Label>
          <Select
            value={form.subcategory}
            onValueChange={(v) => setField("subcategory", v)}
          >
            <SelectTrigger
              id="mkt-subcat"
              className="rounded-xl"
              data-ocid="marketplace-subcategory-select"
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {(SUBCATEGORY_MAP[form.category] ?? []).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <IndianRupee className="h-4 w-4 text-accent" />
          Pricing Calculator
        </p>

        <div className="space-y-2">
          <Label htmlFor="mkt-cost" className="text-xs text-muted-foreground">
            Your Cost Price (₹)
          </Label>
          <Input
            id="mkt-cost"
            type="number"
            placeholder="0"
            min={0}
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            className="rounded-xl"
            data-ocid="marketplace-cost-input"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Profit Margin
            </Label>
            <span className="text-xs font-bold text-accent">
              {form.margin}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            value={form.margin}
            onChange={(e) => setField("margin", Number(e.target.value))}
            className="w-full accent-[oklch(var(--accent))]"
            data-ocid="marketplace-margin-slider"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {costNum > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-primary/10 rounded-xl p-2.5 text-center">
              <p className="text-xs text-muted-foreground">
                Your Selling Price
              </p>
              <p className="font-display font-bold text-base text-primary">
                ₹{suggestedPrice}
              </p>
            </div>
            <div className="bg-muted/60 rounded-xl p-2.5 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" /> Market Price
              </p>
              <p className="font-display font-bold text-base text-muted-foreground">
                ₹{marketPrice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="mkt-qty" className="text-sm font-semibold">
            Quantity
          </Label>
          <Input
            id="mkt-qty"
            type="number"
            placeholder="0"
            min={0}
            value={form.quantity}
            onChange={(e) => setField("quantity", e.target.value)}
            className="rounded-xl"
            data-ocid="marketplace-quantity-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mkt-unit" className="text-sm font-semibold">
            Unit
          </Label>
          <Select value={form.unit} onValueChange={(v) => setField("unit", v)}>
            <SelectTrigger
              id="mkt-unit"
              className="rounded-xl"
              data-ocid="marketplace-unit-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Promotion Scheduling */}
      <div className="space-y-3 bg-card rounded-2xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground">Promotion</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Feature This Listing</p>
            <p className="text-xs text-muted-foreground">
              Appear at top of search results
            </p>
          </div>
          <input
            type="checkbox"
            id="feature-listing"
            checked={form.featureListing}
            onChange={(e) => setField("featureListing", e.target.checked)}
            className="w-5 h-5 rounded accent-[oklch(var(--accent))]"
            data-ocid="marketplace-feature-toggle"
          />
        </div>
        {form.featureListing && (
          <div className="space-y-2">
            <Label
              htmlFor="boost-duration"
              className="text-xs text-muted-foreground"
            >
              Boost Duration
            </Label>
            <Select
              value={form.boostDuration}
              onValueChange={(v) => setField("boostDuration", v)}
            >
              <SelectTrigger
                id="boost-duration"
                className="rounded-xl text-sm"
                data-ocid="marketplace-boost-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Escrow */}
      <div
        className="flex items-center gap-3 rounded-xl p-3"
        style={{
          backgroundColor: "oklch(var(--trust) / 0.08)",
          border: "1px solid oklch(var(--trust) / 0.2)",
        }}
      >
        <input
          type="checkbox"
          id="mkt-escrow"
          checked={form.escrowEnabled}
          onChange={(e) => setField("escrowEnabled", e.target.checked)}
          className="rounded w-4 h-4 accent-[oklch(var(--trust))]"
          data-ocid="marketplace-escrow-toggle"
        />
        <Label
          htmlFor="mkt-escrow"
          className="text-xs text-trust cursor-pointer flex items-center gap-1.5"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Enable Escrow Protection — payment held safely until delivery
        </Label>
      </div>

      <AIEnhancementPanel contentType="listing" />

      <Button
        type="submit"
        disabled={createListing.isPending || !form.name.trim() || !form.price}
        className="w-full bg-accent text-accent-foreground font-semibold rounded-xl h-12 text-base"
        data-ocid="marketplace-post-submit"
      >
        {createListing.isPending ? "Posting..." : "Post to Marketplace"}
      </Button>
    </form>
  );
}
