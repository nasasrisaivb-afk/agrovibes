import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTrustContext } from "../../context/TrustContext";
import { useCart } from "../../hooks/useCart";
import { KycStatus } from "../../types";
import type { Farmer, Listing } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductDetailProps {
  listing: Listing | undefined;
  farmer: Farmer | undefined;
  isLoading: boolean;
  similarListings?: Listing[];
  allFarmers?: Farmer[];
}

export function ProductDetail({
  listing,
  farmer,
  isLoading,
  similarListings = [],
  allFarmers = [],
}: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const { addItem, updateQuantity, items } = useCart();
  const { triggerTrust } = useTrustContext();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <p className="font-semibold text-foreground">Listing not found</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/marketplace" })}
        >
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const existingItem = items.find((i) => i.listingId === listing.id);

  const handleAddToCart = () => {
    if (existingItem) {
      updateQuantity(listing.id, existingItem.quantity + qty);
    } else {
      addItem({
        listingId: listing.id,
        name: listing.name,
        price: listing.price,
        imageUrl: listing.imageUrl,
        farmerName: farmer?.name ?? "Farmer",
      });
      if (qty > 1) updateQuantity(listing.id, qty);
    }
    toast.success(`${qty} × ${listing.name} added to cart`, {
      duration: 3000,
      icon: "🛒",
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    toast.info("Proceeding to checkout…", { duration: 2000 });
  };

  return (
    <div className="flex flex-col pb-32">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border/50">
        <button
          type="button"
          onClick={() => navigate({ to: "/marketplace" })}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="back-to-marketplace"
        >
          <ChevronLeft className="h-4 w-4" />
          Marketplace
        </button>
      </div>

      {/* Product image */}
      <div className="relative w-full h-64 md:h-80 bg-muted">
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {listing.escrowEnabled && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[oklch(var(--trust))]/90 text-white border-0 px-2 py-1 gap-1 text-xs">
              <Lock className="h-3 w-3" />
              Escrow Protected
            </Badge>
          </div>
        )}
        {farmer?.kycStatus === KycStatus.Verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-card/90 text-[oklch(var(--trust))] border-[oklch(var(--trust))]/30 px-2 py-1 gap-1 text-xs">
              <BadgeCheck className="h-3 w-3" />
              KYC Verified
            </Badge>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h1 className="font-display text-xl font-bold leading-tight flex-1">
            {listing.name}
          </h1>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-sm">
              {listing.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">(124)</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-primary">
            ₹{listing.price}
          </span>
          <span className="text-sm text-muted-foreground font-normal">
            / kg
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {listing.description}
        </p>

        {/* Farmer card */}
        {farmer && (
          <div className="bg-muted/40 rounded-2xl p-3 flex items-center gap-3 border border-border/50">
            <img
              src={farmer.avatarUrl}
              alt={farmer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[oklch(var(--success))]/40"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">{farmer.name}</span>
                {farmer.kycStatus === KycStatus.Verified && (
                  <button
                    type="button"
                    onClick={triggerTrust}
                    aria-label="KYC Verified"
                    data-ocid="farmer-kyc-badge"
                  >
                    <BadgeCheck className="h-4 w-4 text-[oklch(var(--trust))]" />
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                📍 {farmer.location} · ⭐ {farmer.rating.toFixed(1)} rating
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {farmer.numListings.toString()} active listings
              </p>
            </div>
            {farmer.kycStatus === KycStatus.Verified ? (
              <Badge className="bg-[oklch(var(--trust))]/10 text-[oklch(var(--trust))] border-[oklch(var(--trust))]/30 text-[10px]">
                KYC ✓
              </Badge>
            ) : farmer.kycStatus === KycStatus.Pending ? (
              <Badge
                variant="outline"
                className="text-warning border-warning/30 text-[10px]"
              >
                Pending
              </Badge>
            ) : null}
          </div>
        )}

        {/* Trust section */}
        <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 flex flex-col gap-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[oklch(var(--trust))]" />
            Buyer Protection
          </h3>
          {listing.escrowEnabled && (
            <button
              type="button"
              onClick={triggerTrust}
              className="flex items-start gap-2.5 text-left transition-smooth hover:bg-card/50 rounded-xl p-2 -mx-2"
              data-ocid="escrow-explainer-detail"
            >
              <Lock className="h-4 w-4 text-[oklch(var(--trust))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[oklch(var(--trust))]">
                  Escrow Protected
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Your payment is held safely until delivery is confirmed.{" "}
                  <span className="text-[oklch(var(--trust))] underline">
                    Learn more →
                  </span>
                </p>
              </div>
            </button>
          )}
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[oklch(var(--success))] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">Fraud Protection</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                All transactions monitored. 100% money-back if item is not as
                described.
              </p>
            </div>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between bg-muted/40 rounded-2xl p-3 border border-border/50">
          <span className="text-sm font-medium">Quantity (kg)</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-smooth"
              aria-label="Decrease quantity"
              data-ocid="qty-decrease"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span
              className="w-8 text-center font-bold text-lg"
              data-ocid="qty-value"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-smooth"
              aria-label="Increase quantity"
              data-ocid="qty-increase"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-bold text-lg text-foreground">
            ₹{(listing.price * qty).toFixed(0)}
          </span>
        </div>

        {/* Similar listings */}
        {similarListings.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-3">Similar Listings</h3>
            <div className="grid grid-cols-3 gap-2">
              {similarListings.slice(0, 3).map((l) => (
                <ProductCard
                  key={l.id.toString()}
                  listing={l}
                  farmer={allFarmers.find((f) => f.id === l.farmerId)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 pt-3 bg-background/95 backdrop-blur-sm border-t border-border/50 z-10">
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-12 text-sm font-semibold gap-1.5 rounded-2xl border-primary text-primary hover:bg-primary/10"
            onClick={handleAddToCart}
            data-ocid="add-to-cart-detail"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart · ₹{(listing.price * qty).toFixed(0)}
          </Button>
          <Button
            size="lg"
            className="flex-1 h-12 text-sm font-semibold gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl"
            onClick={handleBuyNow}
            data-ocid="buy-now-btn"
          >
            <Zap className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
