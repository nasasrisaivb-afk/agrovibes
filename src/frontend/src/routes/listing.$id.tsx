import { ListingStatus } from "@/backend";
import { CheckoutSheet } from "@/components/checkout/CheckoutSheet";
import { ErrorState } from "@/components/shared/ErrorState";
import { DetailSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useListingDetail } from "@/lib/backend";
import { formatInr } from "@/lib/format";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, MapPin, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Route as appLayoutRoute } from "./app-layout";

function ListingDetailScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer, user } = useAuth();
  const listing = useListingDetail(BigInt(id));
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (listing.isPending) return <DetailSkeleton />;
  if (listing.isError) {
    return (
      <ErrorState
        error={listing.error}
        onRetry={() => listing.refetch()}
        retryLabel="Reload listing"
      />
    );
  }

  const data = listing.data;
  const soldOut =
    data.status === ListingStatus.SOLD_OUT || data.quantity === 0n;
  const maxQuantity = Number(data.quantity);
  const isOwnListing = user?.id === data.sellerId;
  const total = Number(data.priceInr) * quantity;
  const images = data.images;

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate({ to: "/auth", search: {} });
      return;
    }
    if (!isBuyer) {
      navigate({ to: "/auth", search: { addRole: "BUYER" } });
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-28 md:pb-4">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="tap-target inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to browse
      </button>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[4/3] bg-muted">
          {images.length > 0 ? (
            <img
              src={images[imageIndex]?.url}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <span className="rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold">
                Sold out
              </span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <fieldset className="flex gap-2 p-2">
            <legend className="sr-only">Photos</legend>
            {images.map((image, i) => (
              <button
                key={image.url.slice(-24) + i.toString()}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Photo ${i + 1}`}
                aria-pressed={imageIndex === i}
                className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${imageIndex === i ? "border-primary" : "border-transparent"}`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </fieldset>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {data.categoryName}
            </p>
            <h1 className="font-display text-xl font-bold leading-snug">
              {data.title}
            </h1>
          </div>
          <p className="whitespace-nowrap font-mono text-xl font-bold text-primary">
            {formatInr(data.priceInr)}
            <span className="block text-right text-xs font-normal text-muted-foreground">
              per {data.unit}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />{" "}
            {data.location}
          </span>
          <span>
            {Number(data.quantity).toLocaleString("en-IN")} {data.unit}{" "}
            available
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display font-bold text-primary">
            {data.sellerName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{data.sellerName}</p>
            <p className="text-xs text-muted-foreground">Seller</p>
          </div>
          {data.sellerKycVerified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-trust/30 bg-trust/10 px-2.5 py-1 text-xs font-medium text-trust">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> KYC
              verified
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.description}
        </p>

        {data.attributes.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Product details</caption>
              <tbody>
                {data.attributes.map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-b border-border last:border-0"
                  >
                    <th
                      scope="row"
                      className="w-2/5 bg-card px-3 py-2.5 text-left font-medium capitalize text-muted-foreground"
                    >
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </th>
                    <td className="px-3 py-2.5">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isOwnListing && !soldOut && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:static md:rounded-2xl md:border md:bg-card">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="tap-target flex items-center justify-center px-3 text-muted-foreground disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span
                className="min-w-10 text-center font-mono text-sm font-semibold"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="tap-target flex items-center justify-center px-3 text-muted-foreground disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Button
              onClick={handleBuy}
              className="tap-target h-12 flex-1 text-base"
            >
              Buy · {formatInr(total)}
            </Button>
          </div>
        </div>
      )}

      {isOwnListing && (
        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          This is your listing. Manage it from the Sell tab.
        </p>
      )}

      <CheckoutSheet
        listing={data}
        quantity={quantity}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/listing/$id",
  component: ListingDetailScreen,
});
