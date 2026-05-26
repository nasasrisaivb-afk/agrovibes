import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  kycOnly: boolean;
  escrowOnly: boolean;
  certifiedOnly: boolean;
  qualityGrade: string;
  distance: string;
  availability: string;
}

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 10000],
  minRating: 0,
  kycOnly: false,
  escrowOnly: false,
  certifiedOnly: false,
  qualityGrade: "all",
  distance: "all",
  availability: "all",
};

function countActiveFilters(f: FilterState): number {
  let count = 0;
  if (f.priceRange[0] > 0 || f.priceRange[1] < 10000) count++;
  if (f.minRating > 0) count++;
  if (f.kycOnly) count++;
  if (f.escrowOnly) count++;
  if (f.certifiedOnly) count++;
  if (f.qualityGrade !== "all") count++;
  if (f.distance !== "all") count++;
  if (f.availability !== "all") count++;
  return count;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

function RangeRow({ label, min, max, value, onChange, format }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-xs text-muted-foreground">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[oklch(var(--accent))] h-1.5 rounded-full"
        aria-label={label}
      />
    </div>
  );
}

interface SelectRowProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (v: string) => void;
}

function SelectRow({ label, value, options, onChange }: SelectRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs font-medium shrink-0">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  ocid: string;
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  ocid,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-[10px] text-muted-foreground">{description}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={ocid}
      />
    </div>
  );
}

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const [local, setLocal] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  const update = <K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    setLocal((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    onChange(local);
    setOpen(false);
  };

  const handleReset = () => {
    setLocal(DEFAULT_FILTERS);
    onChange(DEFAULT_FILTERS);
    setOpen(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (o) setLocal(filters);
    setOpen(o);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-medium transition-smooth hover:bg-muted/80"
          data-ocid="advanced-filters.open_modal_button"
          aria-label="Advanced filters"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          Filters
          {activeCount > 0 && (
            <Badge className="h-4 w-4 p-0 text-[9px] flex items-center justify-center rounded-full bg-accent text-accent-foreground border-0 absolute -top-1.5 -right-1.5">
              {activeCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85vh] overflow-y-auto"
        data-ocid="advanced-filters.dialog"
      >
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="font-display text-base">
            Advanced Filters
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 py-5">
          {/* Price range */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Price Range
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <RangeRow
                  label="Min"
                  min={0}
                  max={9999}
                  value={local.priceRange[0]}
                  onChange={(v) =>
                    update("priceRange", [v, local.priceRange[1]])
                  }
                  format={(v) => `₹${v}`}
                />
              </div>
              <div className="flex-1">
                <RangeRow
                  label="Max"
                  min={1}
                  max={10000}
                  value={local.priceRange[1]}
                  onChange={(v) =>
                    update("priceRange", [local.priceRange[0], v])
                  }
                  format={(v) => `₹${v}`}
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Minimum Rating
            </Label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => update("minRating", r)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-smooth ${
                    local.minRating === r
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Trust toggles */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Trust & Safety
            </Label>
            <div className="flex flex-col gap-3 bg-muted/30 rounded-xl p-3">
              <ToggleRow
                label="KYC Verified Only"
                description="Show listings from identity-verified sellers"
                checked={local.kycOnly}
                onCheckedChange={(v) => update("kycOnly", v)}
                ocid="filter-kyc.switch"
              />
              <ToggleRow
                label="Escrow Protected"
                description="Only listings with payment protection"
                checked={local.escrowOnly}
                onCheckedChange={(v) => update("escrowOnly", v)}
                ocid="filter-escrow.switch"
              />
              <ToggleRow
                label="Certified Only"
                description="Government or institution certified produce"
                checked={local.certifiedOnly}
                onCheckedChange={(v) => update("certifiedOnly", v)}
                ocid="filter-certified.switch"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              More Options
            </Label>
            <SelectRow
              label="Quality Grade"
              value={local.qualityGrade}
              options={[
                { label: "Any Grade", value: "all" },
                { label: "Premium", value: "premium" },
                { label: "Grade A", value: "a" },
                { label: "Grade B", value: "b" },
                { label: "Grade C", value: "c" },
              ]}
              onChange={(v) => update("qualityGrade", v)}
            />
            <SelectRow
              label="Distance"
              value={local.distance}
              options={[
                { label: "Any Distance", value: "all" },
                { label: "Within 10 km", value: "10" },
                { label: "Within 50 km", value: "50" },
                { label: "Within 100 km", value: "100" },
              ]}
              onChange={(v) => update("distance", v)}
            />
            <SelectRow
              label="Availability"
              value={local.availability}
              options={[
                { label: "Any", value: "all" },
                { label: "In Stock Now", value: "now" },
                { label: "This Week", value: "week" },
                { label: "This Month", value: "month" },
              ]}
              onChange={(v) => update("availability", v)}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pb-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            data-ocid="advanced-filters.cancel_button"
          >
            Reset All
          </Button>
          <Button
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleApply}
            data-ocid="advanced-filters.confirm_button"
          >
            Apply Filters {activeCount > 0 && `(${activeCount})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
