import { createRoute } from "@tanstack/react-router";
import { GraduationCap, Leaf, Settings2, Wrench } from "lucide-react";
import { useState } from "react";
import {
  AdvancedFilters,
  DEFAULT_FILTERS,
} from "../components/marketplace/AdvancedFilters";
import type { FilterState } from "../components/marketplace/AdvancedFilters";
import type { MainCategory } from "../components/marketplace/CategoryFilter";
import { CategoryFilter } from "../components/marketplace/CategoryFilter";
import { KnowledgeCategory } from "../components/marketplace/KnowledgeCategory";
import { ProductGrid } from "../components/marketplace/ProductGrid";
import { ServicesCategory } from "../components/marketplace/ServicesCategory";
import { VoiceSearchBar } from "../components/marketplace/VoiceSearchBar";
import { useTrustContext } from "../context/TrustContext";
import { useGetFarmers, useGetListings } from "../lib/backend";
import { KycStatus, ProduceCategory } from "../types";
import type { Farmer, Listing } from "../types";
import { Route as rootRoute } from "./__root";

// ── Fallback sample data ──────────────────────────────────────────────────────

const FALLBACK_LISTINGS: Listing[] = [
  {
    id: BigInt(1),
    farmerId: BigInt(1),
    name: "Organic Red Tomatoes",
    createdAt: BigInt(0),
    description:
      "Hand-picked organic tomatoes from pesticide-free fields. Harvested fresh every morning.",
    imageUrl: "/assets/images/listing-tomatoes.jpg",
    category: ProduceCategory.Vegetables,
    rating: 4.8,
    price: 45,
    escrowEnabled: true,
  },
  {
    id: BigInt(2),
    farmerId: BigInt(2),
    name: "Fresh Maize Cobs",
    createdAt: BigInt(0),
    description:
      "Sweet and tender maize grown on 20 acres in Punjab. Non-GMO, naturally irrigated.",
    imageUrl: "/assets/images/pick-maize.jpg",
    category: ProduceCategory.Grains,
    rating: 4.7,
    price: 28,
    escrowEnabled: true,
  },
  {
    id: BigInt(3),
    farmerId: BigInt(3),
    name: "Desi Basmati Rice",
    createdAt: BigInt(0),
    description:
      "Aged 18-month basmati rice with long grains and rich aroma. Sourced directly from Karnal.",
    imageUrl: "/assets/images/pick-rice.jpg",
    category: ProduceCategory.Grains,
    rating: 4.9,
    price: 95,
    escrowEnabled: true,
  },
  {
    id: BigInt(4),
    farmerId: BigInt(1),
    name: "Alphonso Mangoes",
    createdAt: BigInt(0),
    description:
      "Grade A Hapus mangoes from Ratnagiri, Maharashtra. Limited seasonal supply.",
    imageUrl: "/assets/images/pick-mango.jpg",
    category: ProduceCategory.Fruits,
    rating: 4.8,
    price: 180,
    escrowEnabled: false,
  },
  {
    id: BigInt(5),
    farmerId: BigInt(4),
    name: "Seed Potatoes",
    createdAt: BigInt(0),
    description:
      "Certified disease-free seed potatoes for the Rabi season. High germination rate.",
    imageUrl: "/assets/images/pick-potatoes.jpg",
    category: ProduceCategory.Vegetables,
    rating: 4.9,
    price: 35,
    escrowEnabled: true,
  },
  {
    id: BigInt(6),
    farmerId: BigInt(5),
    name: "A2 Desi Cow Ghee",
    createdAt: BigInt(0),
    description:
      "Traditional bilona-method ghee made from Gir cow milk. A2 protein, 100% pure.",
    imageUrl: "/assets/images/listing-ghee.jpg",
    category: ProduceCategory.Dairy,
    rating: 4.9,
    price: 850,
    escrowEnabled: true,
  },
  {
    id: BigInt(7),
    farmerId: BigInt(2),
    name: "Farm Fresh Eggs",
    createdAt: BigInt(0),
    description:
      "Free-range eggs from happy hens. No hormones, no antibiotics.",
    imageUrl: "/assets/images/listing-eggs.jpg",
    category: ProduceCategory.Eggs,
    rating: 4.7,
    price: 12,
    escrowEnabled: true,
  },
  {
    id: BigInt(8),
    farmerId: BigInt(3),
    name: "Kinnow Oranges",
    createdAt: BigInt(0),
    description:
      "Juicy Kinnow oranges from Punjab. High Vitamin C, sweet tangy taste.",
    imageUrl: "/assets/images/pick-mango.jpg",
    category: ProduceCategory.Fruits,
    rating: 4.6,
    price: 60,
    escrowEnabled: true,
  },
  {
    id: BigInt(9),
    farmerId: BigInt(4),
    name: "Turmeric Powder",
    createdAt: BigInt(0),
    description:
      "Pure ground turmeric from Salem, Tamil Nadu. High curcumin, lab-tested.",
    imageUrl: "/assets/images/listing-ghee.jpg",
    category: ProduceCategory.Other,
    rating: 4.8,
    price: 120,
    escrowEnabled: true,
  },
  {
    id: BigInt(10),
    farmerId: BigInt(5),
    name: "Green Spinach Bunch",
    createdAt: BigInt(0),
    description:
      "Freshly harvested spinach grown without pesticides in Gujarat.",
    imageUrl: "/assets/images/listing-tomatoes.jpg",
    category: ProduceCategory.Vegetables,
    rating: 4.7,
    price: 18,
    escrowEnabled: true,
  },
];

const FALLBACK_FARMERS: Farmer[] = [
  {
    id: BigInt(1),
    name: "Rajesh Kumar",
    bio: "3rd-generation farmer from Amritsar.",
    numListings: BigInt(5),
    kycStatus: KycStatus.Verified,
    avatarUrl: "/assets/images/farmer-1.jpg",
    rating: 4.8,
    location: "Punjab",
  },
  {
    id: BigInt(2),
    name: "Sunita Devi",
    bio: "Small-scale farmer focusing on maize and eggs.",
    numListings: BigInt(3),
    kycStatus: KycStatus.Verified,
    avatarUrl: "/assets/images/farmer-2.jpg",
    rating: 4.7,
    location: "Haryana",
  },
  {
    id: BigInt(3),
    name: "Gurpreet Singh",
    bio: "Rice and citrus specialist from Karnal.",
    numListings: BigInt(7),
    kycStatus: KycStatus.Verified,
    avatarUrl: "/assets/images/farmer-3.jpg",
    rating: 4.9,
    location: "Haryana",
  },
  {
    id: BigInt(4),
    name: "Harpal Singh",
    bio: "Seed potato grower from UP.",
    numListings: BigInt(4),
    kycStatus: KycStatus.Pending,
    avatarUrl: "/assets/images/farmer-4.jpg",
    rating: 4.6,
    location: "Uttar Pradesh",
  },
  {
    id: BigInt(5),
    name: "Priya Patil",
    bio: "Dairy farmer and ghee artisan from Pune.",
    numListings: BigInt(6),
    kycStatus: KycStatus.Verified,
    avatarUrl: "/assets/images/farmer-5.jpg",
    rating: 4.8,
    location: "Maharashtra",
  },
];

// ── Category Tab config ───────────────────────────────────────────────────────

const MAIN_TABS: Array<{
  id: MainCategory;
  label: string;
  icon: React.ReactNode;
  showTrust: boolean;
}> = [
  {
    id: "produce",
    label: "Fresh Produce",
    icon: <Leaf className="h-3.5 w-3.5" />,
    showTrust: true,
  },
  {
    id: "machinery",
    label: "Machinery",
    icon: <Wrench className="h-3.5 w-3.5" />,
    showTrust: true,
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    showTrust: false,
  },
  {
    id: "services",
    label: "Services",
    icon: <Settings2 className="h-3.5 w-3.5" />,
    showTrust: false,
  },
];

// ── Produce tab content ───────────────────────────────────────────────────────

interface ProduceTabProps {
  search: string;
  onSearchChange: (v: string) => void;
  subCategories: string[];
  onSubChange: (v: string[]) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  listings: Listing[];
  farmers: Farmer[];
  isLoading: boolean;
  showTrust: boolean;
  onClearFilters: () => void;
  triggerTrust: () => void;
}

function ProduceTab({
  search,
  onSearchChange,
  subCategories,
  onSubChange,
  filters,
  onFiltersChange,
  listings,
  farmers,
  isLoading,
  showTrust,
  onClearFilters,
  triggerTrust,
}: ProduceTabProps) {
  const filtered = listings.filter((l) => {
    const matchesCat =
      subCategories.includes("all") || subCategories.includes(l.category);
    const matchesSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice =
      l.price >= filters.priceRange[0] && l.price <= filters.priceRange[1];
    const matchesRating = l.rating >= filters.minRating;
    const matchesEscrow = !filters.escrowOnly || l.escrowEnabled;
    const matchesKyc =
      !filters.kycOnly ||
      farmers.find((f) => f.id === l.farmerId)?.kycStatus ===
        KycStatus.Verified;
    return (
      matchesCat &&
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesEscrow &&
      matchesKyc
    );
  });

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-3 pb-2 border-b border-border/50">
        <VoiceSearchBar value={search} onChange={onSearchChange} />
        <div className="flex items-center justify-between mt-2">
          <CategoryFilter
            mainCategory="produce"
            selected={subCategories}
            onChange={onSubChange}
          />
          <div className="pr-4 flex-shrink-0">
            <AdvancedFilters filters={filters} onChange={onFiltersChange} />
          </div>
        </div>
      </div>
      {showTrust && (
        <div className="mx-4 my-3">
          <button
            type="button"
            onClick={triggerTrust}
            className="w-full flex items-center gap-2 rounded-xl p-2.5 text-left transition-smooth"
            style={{
              background: "oklch(var(--trust) / 0.08)",
              border: "1px solid oklch(var(--trust) / 0.2)",
            }}
            data-ocid="trust-banner"
          >
            <span style={{ color: "oklch(var(--trust))" }}>🔒</span>
            <span
              className="text-xs font-medium"
              style={{ color: "oklch(var(--trust))" }}
            >
              All listings are escrow-protected — tap to learn more
            </span>
          </button>
        </div>
      )}
      <div className="px-4 pb-6">
        <ProductGrid
          listings={filtered}
          farmers={farmers}
          isLoading={isLoading}
          onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function MarketplaceContent() {
  const [activeTab, setActiveTab] = useState<MainCategory>("produce");
  const [search, setSearch] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>(["all"]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const { triggerTrust } = useTrustContext();

  const { data: listings, isLoading: listingsLoading } = useGetListings();
  const { data: farmers } = useGetFarmers();

  const displayListings = listings?.length ? listings : FALLBACK_LISTINGS;
  const displayFarmers = farmers?.length ? farmers : FALLBACK_FARMERS;

  const activeTabConfig = MAIN_TABS.find((t) => t.id === activeTab);

  const handleTabChange = (tab: MainCategory) => {
    setActiveTab(tab);
    setSubCategories(["all"]);
    setSearch("");
  };

  const handleClearFilters = () => {
    setSearch("");
    setSubCategories(["all"]);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="flex flex-col">
      {/* Main category tabs */}
      <div className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
        <div
          className="flex"
          role="tablist"
          aria-label="Marketplace categories"
        >
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-[10px] font-semibold transition-smooth border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`marketplace-tab.${tab.id}`}
            >
              <span
                className={
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "produce" && (
        <ProduceTab
          search={search}
          onSearchChange={setSearch}
          subCategories={subCategories}
          onSubChange={setSubCategories}
          filters={filters}
          onFiltersChange={setFilters}
          listings={displayListings}
          farmers={displayFarmers}
          isLoading={listingsLoading}
          showTrust={activeTabConfig?.showTrust ?? false}
          onClearFilters={handleClearFilters}
          triggerTrust={triggerTrust}
        />
      )}

      {activeTab === "machinery" && (
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-3 pb-2 border-b border-border/50">
            <VoiceSearchBar value={search} onChange={setSearch} />
            <div className="flex items-center justify-between mt-2">
              <CategoryFilter
                mainCategory="machinery"
                selected={subCategories}
                onChange={setSubCategories}
              />
              <div className="pr-4 flex-shrink-0">
                <AdvancedFilters filters={filters} onChange={setFilters} />
              </div>
            </div>
          </div>
          {activeTabConfig?.showTrust && (
            <div className="mx-4 my-3">
              <button
                type="button"
                onClick={triggerTrust}
                className="w-full flex items-center gap-2 rounded-xl p-2.5 text-left transition-smooth"
                style={{
                  background: "oklch(var(--trust) / 0.08)",
                  border: "1px solid oklch(var(--trust) / 0.2)",
                }}
                data-ocid="trust-banner-machinery"
              >
                <span style={{ color: "oklch(var(--trust))" }}>🔒</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(var(--trust))" }}
                >
                  Machinery rentals are escrow-protected — tap to learn more
                </span>
              </button>
            </div>
          )}
          <div className="px-4 pb-6">
            <ProductGrid
              listings={displayListings.filter((l) => {
                const matchesSub =
                  subCategories.includes("all") ||
                  subCategories.includes(l.category);
                const matchesSearch =
                  !search ||
                  l.name.toLowerCase().includes(search.toLowerCase());
                return matchesSub && matchesSearch;
              })}
              farmers={displayFarmers}
              isLoading={listingsLoading}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      )}

      {activeTab === "knowledge" && (
        <div className="flex flex-col">
          <div className="px-4 pt-3 pb-2 border-b border-border/50">
            <VoiceSearchBar value={search} onChange={setSearch} />
          </div>
          <div className="mt-2">
            <KnowledgeCategory />
          </div>
        </div>
      )}

      {activeTab === "services" && (
        <div className="flex flex-col">
          <div className="px-4 pt-3 pb-2 border-b border-border/50">
            <VoiceSearchBar value={search} onChange={setSearch} />
          </div>
          <div className="mt-2">
            <ServicesCategory />
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: MarketplaceContent,
});
