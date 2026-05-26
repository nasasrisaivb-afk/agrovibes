import { createRoute } from "@tanstack/react-router";
import { ProductDetail } from "../components/marketplace/ProductDetail";
import { useGetFarmers, useGetListings } from "../lib/backend";
import { KycStatus } from "../types";
import type { Farmer, Listing } from "../types";
import { ProduceCategory } from "../types";
import { Route as rootRoute } from "./__root";

const FALLBACK_LISTINGS: Listing[] = [
  {
    id: BigInt(1),
    farmerId: BigInt(1),
    name: "Organic Red Tomatoes",
    createdAt: BigInt(0),
    description:
      "Hand-picked organic tomatoes from pesticide-free fields. Harvested fresh every morning and packed the same day for maximum freshness.",
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

function MarketplaceDetailContent() {
  const { id } = Route.useParams();
  const { data: listings, isLoading: listingsLoading } = useGetListings();
  const { data: farmers } = useGetFarmers();

  const allListings = listings?.length ? listings : FALLBACK_LISTINGS;
  const allFarmers = farmers?.length ? farmers : FALLBACK_FARMERS;

  const listing = allListings.find((l) => l.id.toString() === id);
  const farmer = listing
    ? allFarmers.find((f) => f.id === listing.farmerId)
    : undefined;

  // Similar listings: same category, excluding current
  const similarListings = listing
    ? allListings
        .filter((l) => l.category === listing.category && l.id !== listing.id)
        .slice(0, 3)
    : [];

  return (
    <ProductDetail
      listing={listing}
      farmer={farmer}
      isLoading={listingsLoading}
      similarListings={similarListings}
      allFarmers={allFarmers}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace/$id",
  component: MarketplaceDetailContent,
});
