import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Calendar,
  DollarSign,
  Wrench,
} from "lucide-react";
import { useGetServices } from "../../lib/backend";

const EQUIPMENT = [
  {
    name: "Mahindra Tractor 575",
    health: "Good",
    available: true,
    rate: "₹1,800/day",
  },
  {
    name: "Rotavator Attachment",
    health: "Service Due",
    available: false,
    rate: "₹400/day",
  },
  {
    name: "Drip Irrigation Set",
    health: "Good",
    available: true,
    rate: "₹600/day",
  },
];

const BOOKINGS = [
  {
    farmer: "Ramesh Patel",
    equipment: "Tractor",
    date: "Apr 16",
    duration: "2 days",
  },
  {
    farmer: "Kavita Singh",
    equipment: "Rotavator",
    date: "Apr 18",
    duration: "1 day",
  },
];

const REQUESTS = [
  {
    farmer: "Suresh Nair",
    need: "Tractor — 3 days",
    when: "Apr 19–21",
    urgent: true,
  },
  {
    farmer: "Lata Yadav",
    need: "Irrigation Set — 1 week",
    when: "Apr 22+",
    urgent: false,
  },
  {
    farmer: "Arjun Kumar",
    need: "Harvester — 2 days",
    when: "Apr 25",
    urgent: false,
  },
];

const WEEKLY_BARS = [3200, 4100, 2800, 5000, 4600, 3900, 8400];
const BAR_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function MachineryDashboard() {
  const navigate = useNavigate();
  const { isLoading: servicesLoading } = useGetServices();

  const maxBar = Math.max(...WEEKLY_BARS);

  return (
    <div className="flex flex-col gap-3 p-4" data-ocid="machinery-dashboard">
      {/* Equipment Status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-[oklch(var(--role-machinery))]" />
            Equipment Status
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-accent"
            onClick={() => navigate({ to: "/marketplace" })}
            data-ocid="machinery-manage-equipment"
          >
            Manage
          </Button>
        </div>
        {servicesLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {EQUIPMENT.map((eq, idx) => (
              <div
                key={eq.name}
                className="flex items-center gap-2.5 bg-card border border-border rounded-xl p-2.5"
                data-ocid={`machinery-equipment-item.${idx + 1}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    eq.available ? "bg-success" : "bg-warning"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{eq.name}</p>
                  <p className="text-[10px] text-muted-foreground">{eq.rate}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[9px] h-4 px-1.5 flex-shrink-0 ${
                    eq.health === "Good"
                      ? "border-success/40 text-success"
                      : "border-warning/40 text-warning"
                  }`}
                >
                  {eq.health}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Bookings */}
      <div className="bg-muted/40 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="h-4 w-4 text-[oklch(var(--role-machinery))]" />
          <span className="text-xs font-semibold">Today's Bookings</span>
        </div>
        <div className="flex flex-col gap-2">
          {BOOKINGS.map((booking, idx) => (
            <div
              key={`${booking.farmer}-${booking.date}`}
              className="flex items-center justify-between"
              data-ocid={`machinery-booking-item.${idx + 1}`}
            >
              <div>
                <p className="text-xs font-semibold">{booking.farmer}</p>
                <p className="text-[10px] text-muted-foreground">
                  {booking.equipment} · {booking.duration}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {booking.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Earnings */}
      <div className="bg-card border border-border rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="text-xs font-semibold">Weekly Earnings</span>
          </div>
          <span className="font-display font-bold text-base text-success">
            ₹8,400
          </span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {WEEKLY_BARS.map((val, idx) => (
            <div
              key={BAR_DAYS[idx]}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-t-sm bg-[oklch(var(--role-machinery)/0.5)]"
                style={{ height: `${(val / maxBar) * 36}px` }}
              />
              <span className="text-[9px] text-muted-foreground">
                {BAR_DAYS[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Reminder */}
      <div
        className="bg-warning/10 border border-[oklch(var(--warning)/0.3)] rounded-2xl p-3 flex items-start gap-2.5"
        data-ocid="machinery-maintenance-reminder"
      >
        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-warning">
            Service Due: Rotavator
          </p>
          <p className="text-[11px] text-muted-foreground">
            Oil change & blade inspection needed before next rental
          </p>
        </div>
      </div>

      {/* New Rental Requests */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Bell className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold">
            Rental Requests ({REQUESTS.length})
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {REQUESTS.map((req, idx) => (
            <div
              key={req.farmer}
              className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2"
              data-ocid={`machinery-request-item.${idx + 1}`}
            >
              <div>
                <p className="text-xs font-semibold">{req.farmer}</p>
                <p className="text-[10px] text-muted-foreground">{req.need}</p>
                <p className="text-[10px] text-muted-foreground">{req.when}</p>
              </div>
              {req.urgent && (
                <Badge
                  variant="outline"
                  className="text-[9px] h-4 px-1.5 border-destructive/40 text-destructive"
                >
                  Urgent
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
