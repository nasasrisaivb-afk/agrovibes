import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { createRoute } from "@tanstack/react-router";
import {
  Bell,
  Eye,
  LayoutGrid,
  List,
  Mic,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { SELLER_LISTINGS } from "../mocks/backend";
import type {
  ContractType,
  PayoutSchedule,
  SellerListing,
  VerificationStatus,
} from "../types";
import { Route as rootRoute } from "./__root";

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid" | "list";

interface FilterState {
  searchQuery: string;
  category: string;
  priceMin: string;
  priceMax: string;
  verification: VerificationStatus | "All";
  payoutSchedules: PayoutSchedule[];
  contractTypes: ContractType[];
  minRating: number;
  germRate: number;
  lotNumber: string;
  hourMeter: number;
  serviceYear: string;
  usdaGrade: string;
}

const CATEGORY_TABS = ["All", "Seeds", "Produce", "Equipment"] as const;

const VERIFICATION_OPTIONS: {
  value: VerificationStatus | "All";
  label: string;
}[] = [
  { value: "All", label: "All" },
  { value: "Approved", label: "Approved" },
  { value: "Pending", label: "Pending" },
  { value: "Expired", label: "Expired" },
];

const PAYOUT_OPTIONS: PayoutSchedule[] = ["Daily", "Weekly", "Net30"];
const CONTRACT_OPTIONS: ContractType[] = ["None", "Phytosanitary", "Rental"];
const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 3, label: "3+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
];
const USDA_OPTIONS = ["Grade A", "Grade B", "Grade C", "Ungraded"];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

const SAVED_SEARCHES = [
  { id: 1, label: "Wheat seeds under ₹2,500", hasAlert: true },
  { id: 2, label: "Tomato Grade A Mumbai", hasAlert: false },
  { id: 3, label: "Tractor rental Punjab", hasAlert: true },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "Seeds":
      return "bg-primary/15 text-primary border-primary/30";
    case "Produce":
      return "bg-accent/15 text-accent border-accent/30";
    case "Equipment":
      return "bg-secondary/15 text-secondary border-secondary/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getVerificationBadge(status: VerificationStatus) {
  switch (status) {
    case "Approved":
      return "bg-success/15 text-success border-success/30";
    case "Pending":
      return "bg-warning/15 text-warning border-warning/30";
    case "Expired":
      return "bg-destructive/15 text-destructive border-destructive/30";
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
      <span className="text-sm font-medium text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function FilterSidebarContent({
  filters,
  setFilters,
  onApply,
  onReset,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
  onReset: () => void;
}) {
  const update = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters],
  );

  const togglePayout = (p: PayoutSchedule) => {
    setFilters((prev) => ({
      ...prev,
      payoutSchedules: prev.payoutSchedules.includes(p)
        ? prev.payoutSchedules.filter((x) => x !== p)
        : [...prev.payoutSchedules, p],
    }));
  };

  const toggleContract = (c: ContractType) => {
    setFilters((prev) => ({
      ...prev,
      contractTypes: prev.contractTypes.includes(c)
        ? prev.contractTypes.filter((x) => x !== c)
        : [...prev.contractTypes, c],
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Filters
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-primary hover:underline"
          data-ocid="discover.clear_filters"
        >
          Clear All
        </button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["price", "category", "verification"]}
        className="w-full flex-1 overflow-y-auto"
      >
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => update("priceMin", e.target.value)}
                  className="pl-6"
                  data-ocid="discover.price_min"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => update("priceMax", e.target.value)}
                  className="pl-6"
                  data-ocid="discover.price_max"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CATEGORY_TABS.slice(1).map((cat) => (
                <label
                  key={cat}
                  htmlFor={`cat-${cat}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={filters.category === cat}
                    onCheckedChange={() =>
                      update("category", filters.category === cat ? "All" : cat)
                    }
                    data-ocid={`discover.filter_category_${cat.toLowerCase()}`}
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Verification
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.verification}
              onValueChange={(v) =>
                update("verification", v as VerificationStatus | "All")
              }
              className="space-y-2"
            >
              {VERIFICATION_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`ver-${opt.value}`}
                    data-ocid={`discover.filter_ver_${opt.value.toLowerCase()}`}
                  />
                  <label
                    htmlFor={`ver-${opt.value}`}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payout">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Payout Schedule
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {PAYOUT_OPTIONS.map((p) => (
                <label
                  key={p}
                  htmlFor={`payout-${p}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    id={`payout-${p}`}
                    checked={filters.payoutSchedules.includes(p)}
                    onCheckedChange={() => togglePayout(p)}
                    data-ocid={`discover.filter_payout_${p.toLowerCase()}`}
                  />
                  <span className="text-sm text-foreground">{p}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contract">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Contract Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CONTRACT_OPTIONS.map((c) => (
                <label
                  key={c}
                  htmlFor={`contract-${c}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    id={`contract-${c}`}
                    checked={filters.contractTypes.includes(c)}
                    onCheckedChange={() => toggleContract(c)}
                    data-ocid={`discover.filter_contract_${c.toLowerCase().replace(/\s/g, "_")}`}
                  />
                  <span className="text-sm text-foreground">{c}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={String(filters.minRating)}
              onValueChange={(v) => update("minRating", Number(v))}
              className="space-y-2"
            >
              {RATING_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={String(opt.value)}
                    id={`rat-${opt.value}`}
                    data-ocid={`discover.filter_rating_${opt.value}`}
                  />
                  <label
                    htmlFor={`rat-${opt.value}`}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="parametric-seeds">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Parametric (Seeds)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="germ-rate"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Germination Rate: {filters.germRate}%
                </label>
                <Slider
                  id="germ-rate"
                  value={[filters.germRate]}
                  onValueChange={([v]) => update("germRate", v)}
                  min={80}
                  max={99}
                  step={1}
                  data-ocid="discover.filter_germ_rate"
                />
              </div>
              <div>
                <label
                  htmlFor="lot-number"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Lot Number
                </label>
                <Input
                  id="lot-number"
                  placeholder="e.g. BATCH-2024-01"
                  value={filters.lotNumber}
                  onChange={(e) => update("lotNumber", e.target.value)}
                  data-ocid="discover.filter_lot_number"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="parametric-equipment">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            Parametric (Equipment)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="hour-meter"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Hour Meter: {filters.hourMeter}h
                </label>
                <Slider
                  id="hour-meter"
                  value={[filters.hourMeter]}
                  onValueChange={([v]) => update("hourMeter", v)}
                  min={0}
                  max={1000}
                  step={10}
                  data-ocid="discover.filter_hour_meter"
                />
              </div>
              <div>
                <label
                  htmlFor="service-year"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Service Year
                </label>
                <Input
                  id="service-year"
                  placeholder="e.g. 2020"
                  value={filters.serviceYear}
                  onChange={(e) => update("serviceYear", e.target.value)}
                  data-ocid="discover.filter_service_year"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usda">
          <AccordionTrigger className="text-sm font-medium text-foreground">
            USDA Grade
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.usdaGrade}
              onValueChange={(v) => update("usdaGrade", v)}
            >
              <SelectTrigger data-ocid="discover.filter_usda_grade">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                {USDA_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <Button
          className="w-full"
          onClick={onApply}
          data-ocid="discover.apply_filters"
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onReset}
          data-ocid="discover.reset_filters"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function ProductCard({
  item,
  viewMode,
}: {
  item: SellerListing;
  viewMode: ViewMode;
}) {
  const isEquipment = item.category === "Equipment";
  const priceSuffix = isEquipment ? "" : "/kg";
  const unitLabel = isEquipment ? "" : "per kg";

  if (viewMode === "list") {
    return (
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow"
        data-ocid={`discover.item.${item.id}`}
      >
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-48 h-48 shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={getCategoryColor(item.category)}
                  >
                    {item.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getVerificationBadge(item.verificationStatus)}
                  >
                    {item.verificationStatus}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground text-base mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <StarRating rating={item.rating} />
                  {item.escrowEnabled && (
                    <Badge
                      variant="outline"
                      className="bg-trust/10 text-trust border-trust/30 text-xs"
                    >
                      Escrow
                    </Badge>
                  )}
                </div>
                {item.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.certifications.slice(0, 2).map((cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="text-[0.7rem]"
                      >
                        {cert}
                      </Badge>
                    ))}
                    {item.certifications.length > 2 && (
                      <Badge variant="secondary" className="text-[0.7rem]">
                        +{item.certifications.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-xl font-bold text-foreground">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {unitLabel}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`discover.view_details_button.${item.id}`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    data-ocid={`discover.add_to_cart_button.${item.id}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
      data-ocid={`discover.item.${item.id}`}
    >
      <div className="aspect-square relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className={getCategoryColor(item.category)}>
            {item.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
          {item.name}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-foreground">
            ₹{item.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">{priceSuffix}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={item.rating} />
          <Badge
            variant="outline"
            className={`text-[0.65rem] ${getVerificationBadge(item.verificationStatus)}`}
          >
            {item.verificationStatus}
          </Badge>
        </div>
        {item.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} variant="secondary" className="text-[0.65rem]">
                {cert}
              </Badge>
            ))}
            {item.certifications.length > 2 && (
              <Badge variant="secondary" className="text-[0.65rem]">
                +{item.certifications.length - 2}
              </Badge>
            )}
          </div>
        )}
        <div className="mt-auto flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            data-ocid={`discover.view_details_button.${item.id}`}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Details
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            data-ocid={`discover.add_to_cart_button.${item.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DiscoverContent() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "All",
    priceMin: "",
    priceMax: "",
    verification: "All",
    payoutSchedules: [],
    contractTypes: [],
    minRating: 0,
    germRate: 80,
    lotNumber: "",
    hourMeter: 0,
    serviceYear: "",
    usdaGrade: "",
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredListings = useMemo(() => {
    let results = [...SELLER_LISTINGS];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q),
      );
    }

    if (filters.category !== "All") {
      results = results.filter((l) => l.category === filters.category);
    }

    if (filters.priceMin) {
      results = results.filter((l) => l.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      results = results.filter((l) => l.price <= Number(filters.priceMax));
    }

    if (filters.verification !== "All") {
      results = results.filter(
        (l) => l.verificationStatus === filters.verification,
      );
    }

    if (filters.payoutSchedules.length > 0) {
      results = results.filter((l) =>
        filters.payoutSchedules.includes(l.payoutSchedule),
      );
    }

    if (filters.contractTypes.length > 0) {
      results = results.filter((l) =>
        filters.contractTypes.includes(l.contractType),
      );
    }

    if (filters.minRating > 0) {
      results = results.filter((l) => l.rating >= filters.minRating);
    }

    if (filters.lotNumber.trim()) {
      results = results.filter((l) =>
        l.bulkUploadBatch
          .toLowerCase()
          .includes(filters.lotNumber.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return results;
  }, [filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.category !== "All") count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.verification !== "All") count++;
    count += filters.payoutSchedules.length;
    count += filters.contractTypes.length;
    if (filters.minRating > 0) count++;
    if (filters.germRate > 80) count++;
    if (filters.lotNumber) count++;
    if (filters.hourMeter > 0) count++;
    if (filters.serviceYear) count++;
    if (filters.usdaGrade) count++;
    return count;
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      category: "All",
      priceMin: "",
      priceMax: "",
      verification: "All",
      payoutSchedules: [],
      contractTypes: [],
      minRating: 0,
      germRate: 80,
      lotNumber: "",
      hourMeter: 0,
      serviceYear: "",
      usdaGrade: "",
    });
  }, []);

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => {
      const next = { ...prev };
      switch (key) {
        case "searchQuery":
        case "priceMin":
        case "priceMax":
        case "lotNumber":
        case "serviceYear":
        case "usdaGrade":
          next[key] = "" as never;
          break;
        case "category":
          next.category = "All";
          break;
        case "verification":
          next.verification = "All";
          break;
        case "minRating":
          next.minRating = 0;
          break;
        case "germRate":
          next.germRate = 80;
          break;
        case "hourMeter":
          next.hourMeter = 0;
          break;
        case "payoutSchedules":
          next.payoutSchedules = [];
          break;
        case "contractTypes":
          next.contractTypes = [];
          break;
      }
      return next;
    });
  };

  const activeChips = useMemo(() => {
    const chips: { key: keyof FilterState; label: string }[] = [];
    if (filters.searchQuery)
      chips.push({
        key: "searchQuery",
        label: `Search: "${filters.searchQuery}"`,
      });
    if (filters.category !== "All")
      chips.push({ key: "category", label: filters.category });
    if (filters.priceMin || filters.priceMax) {
      chips.push({
        key: "priceMin",
        label: `₹${filters.priceMin || 0} - ₹${filters.priceMax || "∞"}`,
      });
    }
    if (filters.verification !== "All")
      chips.push({ key: "verification", label: filters.verification });
    for (const p of filters.payoutSchedules) {
      chips.push({ key: "payoutSchedules", label: p });
    }
    for (const c of filters.contractTypes) {
      chips.push({ key: "contractTypes", label: c });
    }
    if (filters.minRating > 0)
      chips.push({ key: "minRating", label: `${filters.minRating}+ stars` });
    if (filters.germRate > 80)
      chips.push({ key: "germRate", label: `Germ ${filters.germRate}%` });
    if (filters.lotNumber)
      chips.push({ key: "lotNumber", label: `Lot: ${filters.lotNumber}` });
    if (filters.hourMeter > 0)
      chips.push({ key: "hourMeter", label: `Hours ≤${filters.hourMeter}` });
    if (filters.serviceYear)
      chips.push({ key: "serviceYear", label: `Year: ${filters.serviceYear}` });
    if (filters.usdaGrade)
      chips.push({ key: "usdaGrade", label: filters.usdaGrade });
    return chips;
  }, [filters]);

  return (
    <div
      className="min-h-screen bg-background pb-24 lg:pb-0"
      data-ocid="discover.page"
    >
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b px-4 py-3">
        <h1 className="font-display font-bold text-lg text-foreground">
          Discover
        </h1>
        <p className="text-xs text-muted-foreground">
          Search seeds, produce &amp; equipment
        </p>
      </div>

      <div className="flex">
        {/* Web Sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-64px)] sticky top-0 bg-card border-r border-border p-4 overflow-y-auto">
          <FilterSidebarContent
            filters={filters}
            setFilters={setFilters}
            onApply={() => {}}
            onReset={resetFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by crop, variety, region..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                  className="pl-9 pr-4"
                  data-ocid="discover.search_input"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, searchQuery: "" }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative lg:hidden"
                    data-ocid="discover.open_filter_sheet"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[85vh] rounded-t-2xl p-0"
                >
                  <SheetHeader className="px-4 pt-4 pb-2">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-4 h-full overflow-y-auto">
                    <FilterSidebarContent
                      filters={filters}
                      setFilters={setFilters}
                      onApply={() => setMobileFilterOpen(false)}
                      onReset={resetFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="hidden lg:flex items-center gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-ocid="discover.grid_view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-ocid="discover.list_view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {activeChips.map((chip, idx) => (
                  <Badge
                    key={`${chip.key}-${idx}`}
                    variant="secondary"
                    className="text-xs flex items-center gap-1 pr-1"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={() => removeFilter(chip.key)}
                      className="hover:bg-muted rounded-full p-0.5"
                      data-ocid={`discover.remove_filter_${chip.key}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {CATEGORY_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: tab }))
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filters.category === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-ocid={`discover.category_tab_${tab.toLowerCase()}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Bar */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredListings.length}
              </span>{" "}
              results found
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger
                  className="w-[160px] h-8 text-xs"
                  data-ocid="discover.sort_dropdown"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="p-4">
            {filteredListings.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="discover.empty_state"
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  No results found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={resetFilters} data-ocid="discover.reset_empty">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                    : "flex flex-col gap-3"
                }
              >
                {filteredListings.map((item) => (
                  <ProductCard key={item.id} item={item} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Saved Searches */}
            <Separator className="my-6" />
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent" />
                Saved Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {SAVED_SEARCHES.map((ss) => (
                  <Badge
                    key={ss.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors flex items-center gap-1.5 px-3 py-1.5"
                    data-ocid={`discover.saved_search.${ss.id}`}
                  >
                    {ss.label}
                    {ss.hasAlert && (
                      <span className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverContent,
});
