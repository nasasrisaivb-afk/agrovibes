import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  CheckSquare,
  DollarSign,
  FileText,
  Leaf,
  List,
  Minus,
  Sun,
  TrendingDown,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useGetAlerts, useGetListings } from "../../lib/backend";

const MANDI_PRICES = [
  { crop: "Tomato", price: "₹24/kg", trend: "up", pct: "+8%" },
  { crop: "Onion", price: "₹18/kg", trend: "flat", pct: "0%" },
  { crop: "Rice", price: "₹42/kg", trend: "down", pct: "-3%" },
];

const QUICK_ACTIONS = [
  {
    label: "List Produce",
    icon: List,
    href: "/create",
    ocid: "farmer-qa-list",
  },
  {
    label: "Document",
    icon: FileText,
    href: "/create",
    ocid: "farmer-qa-document",
  },
  {
    label: "Prices",
    icon: BarChart2,
    href: "/marketplace",
    ocid: "farmer-qa-prices",
  },
  {
    label: "Ask Expert",
    icon: UserCheck,
    href: "/community",
    ocid: "farmer-qa-expert",
  },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return <TrendingUp className="h-3.5 w-3.5 text-success" />;
  if (trend === "down")
    return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function FarmerDashboard() {
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useGetListings();
  const { data: alerts, isLoading: alertsLoading } = useGetAlerts();

  const myListings = (listings ?? []).slice(0, 2);
  const fieldAlert = (alerts ?? []).find(
    (a) =>
      a.severity === ("High" as string) ||
      a.severity === ("Critical" as string),
  );

  return (
    <div className="flex flex-col gap-3 p-4" data-ocid="farmer-dashboard">
      {/* Today's Summary */}
      <div className="bg-card border border-border rounded-2xl p-4 card-farmer">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="h-5 w-5 text-accent" />
          <h3 className="font-display font-semibold text-sm">
            Today's Summary
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-lg leading-none">
              3
            </span>
            <span className="text-[10px] text-muted-foreground">
              Pending Tasks
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="font-display font-bold text-lg leading-none">
              ₹4,250
            </span>
            <span className="text-[10px] text-muted-foreground">
              Week Earnings
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <Leaf className="h-4 w-4 text-[oklch(var(--role-farmer))]" />
            <span className="font-display font-bold text-lg leading-none">
              5
            </span>
            <span className="text-[10px] text-muted-foreground">
              Active Crops
            </span>
          </div>
        </div>
      </div>

      {/* Mandi Price Tracker */}
      <div className="bg-muted/40 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Live Mandi Prices</span>
        </div>
        <div className="flex flex-col gap-2">
          {MANDI_PRICES.map((item) => (
            <div key={item.crop} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.crop}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {item.price}
                </span>
                <div className="flex items-center gap-0.5">
                  <TrendIcon trend={item.trend} />
                  <span
                    className={`text-[10px] font-bold ${
                      item.trend === "up"
                        ? "text-success"
                        : item.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {item.pct}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Listings */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold">My Active Listings</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-accent"
            onClick={() => navigate({ to: "/marketplace" })}
            data-ocid="farmer-view-listings"
          >
            See All
          </Button>
        </div>
        {listingsLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {myListings.length === 0 ? (
              <div
                className="text-xs text-muted-foreground text-center py-4"
                data-ocid="farmer-listings-empty"
              >
                No active listings. Start selling!
              </div>
            ) : (
              myListings.map((listing, idx) => (
                <div
                  key={listing.id.toString()}
                  className="flex items-center gap-2.5 bg-card border border-border rounded-xl p-2.5"
                  data-ocid={`farmer-listing-item.${idx + 1}`}
                >
                  <img
                    src={listing.imageUrl}
                    alt={listing.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {listing.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{listing.price}/kg
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-success/40 text-success"
                  >
                    Active
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon, href, ocid }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl p-2 hover:bg-muted/40 transition-smooth"
            onClick={() => navigate({ to: href })}
            data-ocid={ocid}
          >
            <Icon className="h-5 w-5 text-[oklch(var(--role-farmer))]" />
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Field Advisory */}
      {alertsLoading ? (
        <Skeleton className="h-16 rounded-2xl" />
      ) : fieldAlert ? (
        <div
          className="bg-warning/10 border border-[oklch(var(--warning)/0.3)] rounded-2xl p-3 flex items-start gap-2.5"
          data-ocid="farmer-field-advisory"
        >
          <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-warning">
              {fieldAlert.title}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {fieldAlert.description}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
