import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { createRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  DollarSign,
  MapPin,
  Mic,
  Minus,
  Search,
  Sprout,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import {
  MARKET_PRICE_TICKS,
  SEASONAL_ALERTS,
  SELLER_LISTINGS,
} from "../mocks/backend";
import type { MarketPriceTick, SeasonalAlert, SellerListing } from "../types";
import { Route as rootRoute } from "./__root";

const QUICK_FILTERS = ["Seeds", "Produce", "Equipment", "Near Me"];

const FARMER_MAP: Record<
  number,
  { name: string; location: string; rating: number; kyc: boolean }
> = {
  1: {
    name: "Rajan Kumar",
    location: "Amritsar, Punjab",
    rating: 4.8,
    kyc: true,
  },
  2: {
    name: "Priya Devi",
    location: "Nashik, Maharashtra",
    rating: 4.7,
    kyc: true,
  },
  3: {
    name: "Suresh Patel",
    location: "Anand, Gujarat",
    rating: 4.9,
    kyc: true,
  },
  4: {
    name: "Lakshmi Rao",
    location: "Guntur, Andhra Pradesh",
    rating: 4.2,
    kyc: false,
  },
  5: {
    name: "Harpreet Singh",
    location: "Ludhiana, Punjab",
    rating: 4.6,
    kyc: true,
  },
  6: {
    name: "Kavitha Nair",
    location: "Thrissur, Kerala",
    rating: 4.5,
    kyc: true,
  },
  7: {
    name: "Ramesh Yadav",
    location: "Varanasi, Uttar Pradesh",
    rating: 3.9,
    kyc: false,
  },
  8: {
    name: "Anita Sharma",
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    kyc: true,
  },
  9: {
    name: "Naresh Reddy",
    location: "Hyderabad, Telangana",
    rating: 4.8,
    kyc: true,
  },
  10: {
    name: "Meena Bisht",
    location: "Dehradun, Uttarakhand",
    rating: 4.6,
    kyc: true,
  },
  11: {
    name: "Naresh Reddy",
    location: "Hyderabad, Telangana",
    rating: 4.8,
    kyc: true,
  },
};

const RESOURCES = [
  {
    title: "Planting Calendar",
    desc: "Plan your crops by season",
    icon: Sprout,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Market Prices",
    desc: "Live mandi rates & futures",
    icon: DollarSign,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Equipment Guides",
    desc: "Maintenance & compatibility",
    icon: Wrench,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  {
    title: "Community Forum",
    desc: "Ask experts & share tips",
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function severityColor(sev: string): string {
  if (sev === "High" || sev === "Critical") return "border-l-red-500";
  if (sev === "Medium") return "border-l-amber-500";
  return "border-l-emerald-500";
}

function severityBadge(sev: string): string {
  if (sev === "High" || sev === "Critical")
    return "bg-red-500/10 text-red-400 border-red-500/20";
  if (sev === "Medium")
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
}

function PriceChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
        <TrendingUp className="w-4 h-4" />+{change}%
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium">
        <TrendingDown className="w-4 h-4" />
        {change}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground text-sm font-medium">
      <Minus className="w-4 h-4" />
      0%
    </span>
  );
}

function HeroSearch() {
  const [active, setActive] = useState(false);
  return (
    <section className="px-4 pt-4 pb-2" data-ocid="home.search.section">
      <div className="max-w-2xl mx-auto">
        <div
          className={`flex items-center gap-2 bg-card border rounded-xl px-4 py-3 shadow-sm transition-all ${active ? "border-primary ring-1 ring-primary/30" : "border-border"}`}
          data-ocid="home.search.input"
        >
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search seeds, produce, equipment..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          />
          <button
            type="button"
            className={`p-2 rounded-full transition-all ${active ? "voice-pulse" : "hover:bg-muted"}`}
            data-ocid="home.search.voice_button"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_FILTERS.map((f) => (
            <Badge
              key={f}
              variant="secondary"
              className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              data-ocid={`home.filter.${f.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeasonalPulse() {
  const summary = [
    { label: "Tomato", value: "+12.5%", up: true },
    { label: "Wheat", value: "-1.2%", up: false },
    { label: "Chilli", value: "+15.7%", up: true },
  ];
  return (
    <section className="px-4 py-4" data-ocid="home.seasonal_pulse.section">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          Seasonal Pulse
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {SEASONAL_ALERTS.slice(0, 3).map((alert: SeasonalAlert) => (
          <div
            key={alert.id}
            className={`min-w-[280px] lg:min-w-0 bg-card border border-border rounded-xl p-4 ${severityColor(alert.severity)} border-l-4 shadow-sm`}
            data-ocid={`home.alert.item.${alert.id}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={`text-[0.7rem] ${severityBadge(alert.severity)}`}
              >
                {alert.severity}
              </Badge>
              <Badge variant="secondary" className="text-[0.7rem]">
                {alert.cropName}
              </Badge>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {alert.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {alert.description}
            </p>
            <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {alert.region}
              </span>
              <span>{timeAgo(alert.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-3 overflow-x-auto scrollbar-hide">
        {summary.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 min-w-fit"
            data-ocid={`home.summary.${s.label.toLowerCase()}`}
          >
            <span className="text-sm font-medium text-foreground">
              {s.label}
            </span>
            <span
              className={`text-sm font-bold ${s.up ? "text-emerald-400" : "text-red-400"}`}
            >
              {s.value} {s.up ? "↑" : "↓"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketPrices() {
  return (
    <section className="px-4 py-4" data-ocid="home.prices.section">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          Today&apos;s Prices
        </h2>
      </div>
      {/* Mobile: horizontal scroll chips */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:hidden">
        {MARKET_PRICE_TICKS.map((tick: MarketPriceTick) => (
          <div
            key={tick.id}
            className="min-w-[160px] bg-card border border-border rounded-xl p-3 shadow-sm"
            data-ocid={`home.price.item.${tick.id}`}
          >
            <div className="text-sm font-semibold text-foreground">
              {tick.cropName}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              ₹{tick.price}/qtl
            </div>
            <PriceChange change={tick.changePercent} />
          </div>
        ))}
      </div>
      {/* Web: table */}
      <div className="hidden lg:block bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Crop
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Price (₹/qtl)
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Change
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {MARKET_PRICE_TICKS.map((tick: MarketPriceTick) => (
              <tr
                key={tick.id}
                className="data-table-row"
                data-ocid={`home.price.row.${tick.id}`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {tick.cropName}
                </td>
                <td className="px-4 py-3 text-foreground">
                  ₹{tick.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <PriceChange change={tick.changePercent} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    data-ocid={`home.price.trade.${tick.id}`}
                  >
                    Trade
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TrustedSellers() {
  const sellers = SELLER_LISTINGS.slice(0, 6);
  return (
    <section className="px-4 py-4" data-ocid="home.sellers.section">
      <div className="flex items-center gap-2 mb-3">
        <BadgeCheck className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          Trusted Sellers Near You
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sellers.map((s: SellerListing, idx: number) => {
          const farmer = FARMER_MAP[s.farmerId] || {
            name: `Farmer ${s.farmerId}`,
            location: s.description.slice(0, 20),
            rating: s.rating,
            kyc: false,
          };
          const initial = farmer.name.charAt(0);
          const roleLabel =
            s.category === "Equipment"
              ? "Machinery Owner"
              : s.category === "Seeds"
                ? "Seller"
                : "Farmer";
          return (
            <div
              key={s.id}
              className="bg-card border border-border rounded-xl p-3 shadow-sm flex flex-col gap-2"
              data-ocid={`home.seller.item.${idx + 1}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {farmer.name}
                  </div>
                  <Badge variant="secondary" className="text-[0.65rem] h-5">
                    {roleLabel}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{farmer.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-foreground">
                  {farmer.rating}
                </span>
                {farmer.kyc && (
                  <Badge
                    variant="outline"
                    className="text-[0.6rem] h-4 ml-auto border-emerald-500/30 text-emerald-400"
                  >
                    <BadgeCheck className="w-3 h-3 mr-0.5" />
                    KYC
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full h-8 text-xs mt-auto hover:bg-primary/10 hover:text-primary"
                data-ocid={`home.seller.view.${idx + 1}`}
              >
                View Profile
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ResourcesHub() {
  return (
    <section className="px-4 py-4" data-ocid="home.resources.section">
      <div className="flex items-center gap-2 mb-3">
        <Sprout className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          Quick Access
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {RESOURCES.map((r) => (
          <Link
            key={r.title}
            to="/resources"
            className={`flex flex-col gap-2 bg-card border ${r.border} rounded-xl p-4 shadow-sm hover:shadow-md transition-all group`}
            data-ocid={`home.resource.${r.title.toLowerCase().replace(/\s+/g, "_")}`}
          >
            <div
              className={`w-10 h-10 rounded-lg ${r.bg} flex items-center justify-center`}
            >
              <r.icon className={`w-5 h-5 ${r.color}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {r.title}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {r.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RightSidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col gap-4 w-80 shrink-0"
      data-ocid="home.sidebar"
    >
      {/* Active Alerts */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">
            Active Alerts
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {SEASONAL_ALERTS.slice(0, 2).map((alert: SeasonalAlert) => (
            <div
              key={alert.id}
              className={`border-l-2 ${severityColor(alert.severity)} pl-3 py-1`}
            >
              <div className="text-xs font-medium text-foreground">
                {alert.title}
              </div>
              <div className="text-[0.7rem] text-muted-foreground line-clamp-1">
                {alert.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Price Summary
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {MARKET_PRICE_TICKS.slice(0, 5).map((tick: MarketPriceTick) => (
            <div key={tick.id} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{tick.cropName}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  ₹{tick.price}
                </span>
                <PriceChange change={tick.changePercent} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-col gap-2">
          <Link to="/sell" data-ocid="home.sidebar.list_produce">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              List Produce
            </Button>
          </Link>
          <Link to="/discover" data-ocid="home.sidebar.browse_listings">
            <Button className="w-full" variant="outline" size="sm">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function HomeContent() {
  return (
    <div className="lg:flex lg:gap-6 lg:max-w-7xl lg:mx-auto lg:px-4 lg:py-6">
      <div className="flex-1 min-w-0">
        <HeroSearch />
        <SeasonalPulse />
        <MarketPrices />
        <TrustedSellers />
        <ResourcesHub />
      </div>
      <RightSidebar />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeContent,
});
