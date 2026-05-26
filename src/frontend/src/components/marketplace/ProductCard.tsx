import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Lock, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useTrustContext } from "../../context/TrustContext";
import { useCart } from "../../hooks/useCart";
import { KycStatus } from "../../types";
import type { Farmer, Listing } from "../../types";

interface ProductCardProps {
  listing: Listing;
  farmer?: Farmer;
}

function TrustScoreBar({ rating }: { rating: number }) {
  const pct = Math.round((rating / 5) * 100);
  const color =
    rating >= 4.5
      ? "oklch(var(--success))"
      : rating >= 4.0
        ? "oklch(var(--accent))"
        : "oklch(var(--warning))";
  return (
    <div className="h-0.5 bg-muted rounded-full overflow-hidden" aria-hidden>
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function ProductCard({ listing, farmer }: ProductCardProps) {
  const { addItem } = useCart();
  const { triggerTrust } = useTrustContext();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      listingId: listing.id,
      name: listing.name,
      price: listing.price,
      imageUrl: listing.imageUrl,
      farmerName: farmer?.name ?? "Farmer",
    });
    toast.success(`${listing.name} added to cart`, {
      duration: 3000,
      icon: "🛒",
    });
  };

  const handleKycClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTrust();
  };

  return (
    <button
      type="button"
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col cursor-pointer transition-smooth hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] text-left w-full"
      data-ocid="listing-card"
      aria-label={`View ${listing.name}`}
      onClick={() =>
        navigate({
          to: "/marketplace/$id",
          params: { id: listing.id.toString() },
        })
      }
    >
      {/* Image + trust score bar */}
      <div className="relative h-[150px] bg-muted overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-full object-cover transition-smooth hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {/* Escrow badge */}
        {listing.escrowEnabled && (
          <div className="absolute top-1.5 right-1.5">
            <Badge className="bg-[oklch(var(--trust))]/90 text-white border-0 text-[9px] px-1.5 py-0.5 gap-0.5">
              <Lock className="h-2.5 w-2.5" />
              Escrow
            </Badge>
          </div>
        )}
        {/* KYC badge on image when farmer is verified */}
        {farmer?.kycStatus === KycStatus.Verified && (
          <div className="absolute top-1.5 left-1.5">
            <button
              type="button"
              onClick={handleKycClick}
              aria-label="KYC Verified — tap to learn more"
              data-ocid="kyc-badge"
              className="flex items-center gap-0.5 bg-card/90 rounded-full px-1.5 py-0.5"
            >
              <BadgeCheck className="h-3 w-3 text-[oklch(var(--trust))]" />
              <span className="text-[9px] font-semibold text-[oklch(var(--trust))]">
                KYC
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Trust score bar */}
      <TrustScoreBar rating={listing.rating} />

      {/* Content */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        {farmer && (
          <div className="flex items-center gap-1.5">
            <img
              src={farmer.avatarUrl}
              alt={farmer.name}
              className="w-5 h-5 rounded-full object-cover border border-[oklch(var(--success))]/50"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
            <span className="text-[10px] text-muted-foreground truncate flex-1 min-w-0">
              {farmer.name}
            </span>
          </div>
        )}

        <p className="font-semibold text-sm leading-tight line-clamp-2">
          {listing.name}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-primary text-sm">
            ₹{listing.price}
            <span className="text-[10px] font-normal text-muted-foreground">
              /kg
            </span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
            {listing.rating.toFixed(1)}
          </span>
        </div>

        <Button
          size="sm"
          className="w-full h-7 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/90 mt-auto"
          onClick={handleAddToCart}
          data-ocid="add-to-cart"
        >
          <ShoppingCart className="h-3 w-3" />
          Add to Cart
        </Button>
      </div>
    </button>
  );
}
