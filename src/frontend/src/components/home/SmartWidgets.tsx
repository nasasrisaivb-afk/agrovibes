import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Cloud, Sun, TrendingUp, Wrench, Zap } from "lucide-react";
import type { UserRole } from "../../context/RoleContext";

interface SmartWidgetsProps {
  role: UserRole;
  isLoading?: boolean;
}

const WEATHER = {
  icon: Sun,
  temp: "28°C",
  condition: "Partly Cloudy",
  advisory: "Good day for harvesting",
};

const PRICE_TRENDS = [
  { crop: "Tomato", price: "₹24/kg", delta: "+12%", up: true },
  { crop: "Onion", price: "₹18/kg", delta: "+2%", up: true },
  { crop: "Rice", price: "₹42/kg", delta: "-3%", up: false },
];

const SPARKLINE_DATA = [40, 55, 48, 62, 70, 65, 75];

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 24;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const color = up ? "oklch(var(--success))" : "oklch(var(--destructive))";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WidgetCard({
  children,
  label,
}: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="flex-shrink-0 w-44 bg-card border border-border rounded-2xl p-3 flex flex-col gap-2 shadow-sm"
      aria-label={label}
    >
      {children}
    </div>
  );
}

export function SmartWidgets({ role, isLoading }: SmartWidgetsProps) {
  if (isLoading) {
    return (
      <div
        className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1"
        data-ocid="smart-widgets-loading"
      >
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="flex-shrink-0 w-44 h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const WeatherIcon = WEATHER.condition.includes("Cloud") ? Cloud : Sun;

  return (
    <section
      className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1"
      data-ocid="smart-widgets"
      aria-label="Smart widgets"
    >
      {/* Weather Widget */}
      <WidgetCard label="Weather widget">
        <div className="flex items-center gap-2">
          <WeatherIcon className="h-5 w-5 text-accent flex-shrink-0" />
          <span className="font-display font-bold text-lg leading-none">
            {WEATHER.temp}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{WEATHER.condition}</p>
        <p className="text-[10px] font-medium text-success leading-tight">
          {WEATHER.advisory}
        </p>
      </WidgetCard>

      {/* Price Trends Widget */}
      <WidgetCard label="Price trends widget">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-xs font-semibold">Price Trends</span>
        </div>
        {PRICE_TRENDS.slice(0, 2).map((p) => (
          <div key={p.crop} className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">{p.crop}</span>
            <span
              className={`text-[11px] font-bold ${p.up ? "text-success" : "text-destructive"}`}
            >
              {p.delta}
            </span>
          </div>
        ))}
        <MiniSparkline data={SPARKLINE_DATA} up />
      </WidgetCard>

      {/* Learning Progress Widget */}
      <WidgetCard label="Learning progress widget">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-[oklch(var(--role-educator))] flex-shrink-0" />
          <span className="text-xs font-semibold">Learning</span>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1">
          Modern Irrigation Methods
        </p>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[oklch(var(--role-educator))] rounded-full"
            style={{ width: "62%" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">62% complete</p>
      </WidgetCard>

      {/* Equipment Health (machinery role only) */}
      {role === "machinery" && (
        <WidgetCard label="Equipment health widget">
          <div className="flex items-center gap-1.5">
            <Wrench className="h-4 w-4 text-[oklch(var(--role-machinery))] flex-shrink-0" />
            <span className="text-xs font-semibold">Equipment</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="font-display font-bold text-2xl leading-none text-[oklch(var(--role-machinery))]">
              87
            </span>
            <span className="text-xs text-muted-foreground pb-0.5">/100</span>
          </div>
          <p className="text-[10px] text-success">Health: Good</p>
        </WidgetCard>
      )}

      {/* Market Opportunity Widget */}
      <WidgetCard label="Market opportunity widget">
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-xs font-semibold">Opportunity</span>
        </div>
        <p className="text-[11px] font-medium text-foreground leading-tight">
          Tomatoes 15% above avg
        </p>
        <p className="text-[10px] text-success">Good time to sell!</p>
      </WidgetCard>
    </section>
  );
}
