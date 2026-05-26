import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Clock,
  Package,
  ShieldCheck,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useGetFarmers, useGetListings, useGetOrders } from "../../lib/backend";

const PRICE_ALERTS = [
  { name: "Organic Tomatoes", price: "₹24/kg", deal: "good", prev: "₹32/kg" },
  { name: "Basmati Rice", price: "₹65/kg", deal: "bad", prev: "₹58/kg" },
  { name: "Sweet Corn", price: "₹28/kg", deal: "good", prev: "₹35/kg" },
];

const RECENT_ORDERS_STATIC = [
  {
    id: "ORD-201",
    item: "Alphonso Mangoes",
    status: "Delivered",
    date: "Apr 12",
  },
  {
    id: "ORD-198",
    item: "Seed Potatoes",
    status: "In Transit",
    date: "Apr 14",
  },
];

export function BuyerDashboard() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: listings, isLoading: listingsLoading } = useGetListings();
  const { data: farmers, isLoading: farmersLoading } = useGetFarmers();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();

  const freshPicks = (listings ?? []).slice(0, 4);
  const featuredFarmer = (farmers ?? []).find(
    (f) => f.kycStatus === ("Verified" as string),
  );
  const recentOrders = (orders ?? []).slice(0, 2);
  const isLoading = listingsLoading || farmersLoading;

  return (
    <div className="flex flex-col gap-3 p-4" data-ocid="buyer-dashboard">
      {/* Fresh Picks */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
            <ShoppingCart className="h-4 w-4 text-[oklch(var(--role-buyer))]" />
            Fresh Picks For You
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-accent"
            onClick={() => navigate({ to: "/marketplace" })}
            data-ocid="buyer-see-all-picks"
          >
            See All
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {freshPicks.map((listing, idx) => (
              <div
                key={listing.id.toString()}
                className="bg-card border border-border rounded-xl overflow-hidden"
                data-ocid={`buyer-pick-item.${idx + 1}`}
              >
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className="w-full h-20 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div className="p-2">
                  <p className="text-xs font-semibold line-clamp-1">
                    {listing.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-primary">
                      ₹{listing.price}/kg
                    </span>
                    <button
                      type="button"
                      className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth"
                      onClick={() =>
                        addItem({
                          listingId: listing.id,
                          name: listing.name,
                          price: listing.price,
                          imageUrl: listing.imageUrl,
                          farmerName: "Farmer",
                        })
                      }
                      aria-label={`Add ${listing.name} to cart`}
                      data-ocid={`buyer-add-to-cart.${idx + 1}`}
                    >
                      <ShoppingCart className="h-3 w-3 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Alerts */}
      <div className="bg-muted/40 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Bell className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold">Price Alerts</span>
        </div>
        <div className="flex flex-col gap-2">
          {PRICE_ALERTS.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {item.price}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[9px] h-4 px-1.5 ${
                    item.deal === "good"
                      ? "border-success/40 text-success"
                      : "border-destructive/40 text-destructive"
                  }`}
                >
                  {item.deal === "good" ? "Good Deal" : "High"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Recent Orders</span>
        </div>
        {ordersLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(recentOrders.length > 0
              ? recentOrders
              : RECENT_ORDERS_STATIC
            ).map((order, idx) => {
              const id =
                "id" in order ? String(order.id) : (order as { id: string }).id;
              const item =
                "listingId" in order
                  ? `Order #${id}`
                  : (order as { item: string }).item;
              const status =
                "status" in order
                  ? String(order.status).replace(/"/g, "")
                  : "Pending";
              const date =
                "createdAt" in order
                  ? "Recently"
                  : (order as { date: string }).date;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2.5"
                  data-ocid={`buyer-order-item.${idx + 1}`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">{item}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[9px] h-4 px-1.5 ${
                      status === "Delivered"
                        ? "border-success/40 text-success"
                        : "border-accent/40 text-accent"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Order CTA */}
      <button
        type="button"
        className="bg-[oklch(var(--role-buyer)/0.08)] border border-[oklch(var(--role-buyer)/0.25)] rounded-2xl p-3 flex items-center gap-3 hover:bg-[oklch(var(--role-buyer)/0.12)] transition-smooth text-left w-full"
        onClick={() => navigate({ to: "/marketplace" })}
        data-ocid="buyer-bulk-order-cta"
      >
        <div className="w-9 h-9 rounded-xl bg-[oklch(var(--role-buyer)/0.15)] flex items-center justify-center flex-shrink-0">
          <Package className="h-5 w-5 text-[oklch(var(--role-buyer))]" />
        </div>
        <div>
          <p className="text-sm font-semibold">Place Bulk Order</p>
          <p className="text-[11px] text-muted-foreground">
            Get better prices on large orders
          </p>
        </div>
      </button>

      {/* Trusted Seller Spotlight */}
      {farmersLoading ? (
        <Skeleton className="h-16 rounded-2xl" />
      ) : featuredFarmer ? (
        <div
          className="bg-card border border-[oklch(var(--trust)/0.25)] rounded-2xl p-3 flex items-center gap-3"
          data-ocid="buyer-trusted-seller"
        >
          <img
            src={featuredFarmer.avatarUrl}
            alt={featuredFarmer.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold truncate">
                {featuredFarmer.name}
              </p>
              <ShieldCheck className="h-3.5 w-3.5 text-[oklch(var(--trust))] flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-[10px] text-muted-foreground">
                {featuredFarmer.location}
              </span>
            </div>
          </div>
          <Badge className="text-[9px] h-5 px-2 bg-[oklch(var(--trust)/0.12)] text-[oklch(var(--trust))] border border-[oklch(var(--trust)/0.3)]">
            KYC Verified
          </Badge>
        </div>
      ) : null}
    </div>
  );
}
