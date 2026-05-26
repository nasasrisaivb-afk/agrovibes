import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Briefcase,
  DollarSign,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import { useGetServices } from "../../lib/backend";

const REQUESTS = [
  {
    id: "R-401",
    type: "Ploughing",
    farmer: "Ramesh Yadav",
    location: "Pune, MH",
    urgency: "high",
  },
  {
    id: "R-402",
    type: "Spraying",
    farmer: "Sita Devi",
    location: "Nashik, MH",
    urgency: "normal",
  },
  {
    id: "R-403",
    type: "Harvesting Help",
    farmer: "Balan Nair",
    location: "Thrissur, KL",
    urgency: "high",
  },
  {
    id: "R-404",
    type: "Transport",
    farmer: "Mohan Gupta",
    location: "Jaipur, RJ",
    urgency: "normal",
  },
];

const ACTIVE_JOBS = [
  {
    id: "J-301",
    type: "Irrigation Setup",
    farmer: "Kavya Reddy",
    completion: 65,
    location: "Hyderabad, TS",
  },
  {
    id: "J-302",
    type: "Soil Testing",
    farmer: "Arjun Mehta",
    completion: 40,
    location: "Ahmedabad, GJ",
  },
];

export function ServiceDashboard() {
  const { isLoading } = useGetServices();

  return (
    <div className="flex flex-col gap-3 p-4" data-ocid="service-dashboard">
      {/* Request Alerts */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <AlertCircle className="h-4 w-4 text-[oklch(var(--role-service))]" />
          <span className="text-xs font-semibold">
            New Requests ({REQUESTS.length})
          </span>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {REQUESTS.map((req, idx) => (
              <div
                key={req.id}
                className="bg-card border border-border rounded-xl p-3 flex items-start justify-between gap-2"
                data-ocid={`service-request-item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{req.type}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {req.farmer}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {req.location}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[9px] h-4 px-1.5 ${
                      req.urgency === "high"
                        ? "border-destructive/40 text-destructive"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {req.urgency === "high" ? "Urgent" : "Normal"}
                  </Badge>
                  <button
                    type="button"
                    className="text-[10px] text-primary font-medium hover:text-primary/70 transition-smooth"
                    data-ocid={`service-accept-request.${idx + 1}`}
                  >
                    Accept →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Jobs */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Briefcase className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold">Active Jobs</span>
        </div>
        <div className="flex flex-col gap-2">
          {ACTIVE_JOBS.map((job, idx) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`service-job-item.${idx + 1}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold">{job.type}</p>
                <span className="text-[10px] text-muted-foreground">
                  {job.completion}% done
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-1.5">
                {job.farmer} · {job.location}
              </p>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[oklch(var(--role-service))] rounded-full transition-smooth"
                  style={{ width: `${job.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating & Reputation */}
      <div className="bg-card border border-[oklch(var(--trust)/0.25)] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[oklch(var(--trust))]" />
              Rating & Reputation
            </p>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-display font-bold text-xl leading-none">
                4.7
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-xl leading-none">142</p>
            <p className="text-[10px] text-muted-foreground">Jobs Completed</p>
          </div>
          <div className="trust-indicator-badge ml-auto">
            <Shield className="h-3 w-3" />
            KYC
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-muted/40 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-success" />
          <div>
            <p className="text-xs font-semibold">Earnings This Month</p>
            <p className="text-[10px] text-muted-foreground">
              Across 24 completed jobs
            </p>
          </div>
        </div>
        <span className="font-display font-bold text-xl text-success">
          ₹12,200
        </span>
      </div>

      {/* Service Area */}
      <div
        className="bg-muted/40 border border-border rounded-2xl p-3 flex items-center gap-2"
        data-ocid="service-area-widget"
      >
        <MapPin className="h-5 w-5 text-[oklch(var(--role-service))] flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold">Service Area</p>
          <p className="text-[11px] text-muted-foreground">
            Maharashtra, Gujarat, Goa — 5 active districts
          </p>
        </div>
      </div>
    </div>
  );
}
