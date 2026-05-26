import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeCheck,
  MapPin,
  Package,
  Star,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useGetServices } from "../../lib/backend";
import type {
  ExpertProfile,
  LogisticsListing,
  MachineryListing,
} from "../../types";

// ── Static labor & storage data ──────────────────────────────────────────────
const LABOR_SERVICES = [
  {
    id: 1,
    name: "Ravi Kumar & Team",
    specialty: "Wheat & Paddy Harvesting",
    rate: 450,
    rateUnit: "/day",
    location: "Punjab",
    rating: 4.8,
    kycVerified: true,
    avatar: "https://picsum.photos/seed/lab1/80/80",
  },
  {
    id: 2,
    name: "Anand Tractor Works",
    specialty: "Land Preparation & Tilling",
    rate: 1200,
    rateUnit: "/day",
    location: "Haryana",
    rating: 4.7,
    kycVerified: true,
    avatar: "https://picsum.photos/seed/lab2/80/80",
  },
  {
    id: 3,
    name: "Suresh Irrigation Co.",
    specialty: "Drip & Sprinkler Setup",
    rate: 800,
    rateUnit: "/day",
    location: "Gujarat",
    rating: 4.6,
    kycVerified: false,
    avatar: "https://picsum.photos/seed/lab3/80/80",
  },
];

const STORAGE_FACILITIES = [
  {
    id: 1,
    name: "ColdStar Agri Storage",
    type: "Cold Storage",
    capacity: "500 MT",
    ratePerMT: 80,
    location: "Nashik, Maharashtra",
    available: true,
  },
  {
    id: 2,
    name: "GrainSafe Warehouse",
    type: "Dry Warehouse",
    capacity: "1200 MT",
    ratePerMT: 45,
    location: "Amritsar, Punjab",
    available: true,
  },
  {
    id: 3,
    name: "FreshVault Processing",
    type: "Processing + Storage",
    capacity: "300 MT",
    ratePerMT: 110,
    location: "Pune, Maharashtra",
    available: false,
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function MachineryCard({ m }: { m: MachineryListing }) {
  const handleBook = () => {
    if (!m.available) {
      toast.info(
        "This equipment is currently unavailable. You'll be notified when free.",
      );
      return;
    }
    toast.success(`Booking request sent for "${m.name}"`, {
      duration: 3000,
      icon: "🚜",
    });
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col"
      data-ocid="machinery-card"
    >
      <div className="relative h-[120px] bg-muted overflow-hidden">
        <img
          src={m.imageUrl}
          alt={m.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        <Badge
          className={`absolute top-1.5 right-1.5 text-[9px] border-0 ${m.available ? "bg-[oklch(var(--success))]/90 text-white" : "bg-muted-foreground/70 text-white"}`}
        >
          {m.available ? "Available" : "Booked"}
        </Badge>
      </div>
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <p className="font-semibold text-xs leading-tight line-clamp-1">
          {m.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-xs">
            ₹{m.dailyRate}
            <span className="text-[9px] font-normal text-muted-foreground">
              /day
            </span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            {m.category}
          </span>
        </div>
        <Button
          size="sm"
          className="w-full h-7 text-[10px] mt-auto"
          variant={m.available ? "default" : "outline"}
          disabled={!m.available}
          onClick={handleBook}
          data-ocid="machinery-book-btn"
        >
          <Wrench className="h-3 w-3 mr-1" />
          {m.available ? "Book Now" : "Notify Me"}
        </Button>
      </div>
    </div>
  );
}

function LaborCard({ l }: { l: (typeof LABOR_SERVICES)[0] }) {
  const handleHire = () => {
    toast.success(`Hire request sent to "${l.name}"`, {
      duration: 3000,
      icon: "👷",
    });
  };
  return (
    <div
      className="bg-card rounded-2xl border border-border p-3 flex items-start gap-3 shadow-sm"
      data-ocid="labor-card"
    >
      <div className="relative">
        <img
          src={l.avatar}
          alt={l.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-border flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {l.kycVerified && (
          <BadgeCheck className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-[oklch(var(--trust))]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{l.name}</p>
        <p className="text-[10px] text-muted-foreground">{l.specialty}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px]">
          <span className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
            {l.rating}
          </span>
          <span className="font-medium text-primary">
            ₹{l.rate}
            {l.rateUnit}
          </span>
          <span className="flex items-center gap-0.5 text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" />
            {l.location}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className="h-7 text-[10px] shrink-0"
        onClick={handleHire}
        data-ocid="hire-labor-btn"
      >
        Hire
      </Button>
    </div>
  );
}

function LogisticsCard({ l }: { l: LogisticsListing }) {
  const handleRequest = () => {
    toast.success(`Transport request sent to "${l.providerName}"`, {
      duration: 3000,
      icon: "🚚",
    });
  };
  return (
    <div
      className="bg-card rounded-2xl border border-border p-3 flex items-start gap-3 shadow-sm"
      data-ocid="logistics-card"
    >
      <img
        src={l.imageUrl}
        alt={l.providerName}
        className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/images/placeholder.svg";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{l.providerName}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {l.serviceArea}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-primary">
            ₹{l.ratePerKm}/km
          </span>
          <Badge
            variant="outline"
            className="text-[9px] px-1.5 py-0 border-[oklch(var(--trust))]/40 text-[oklch(var(--trust))]"
          >
            Escrow ✓
          </Badge>
        </div>
      </div>
      <Button
        size="sm"
        className="h-7 text-[10px] shrink-0"
        onClick={handleRequest}
        data-ocid="transport-book-btn"
      >
        Book
      </Button>
    </div>
  );
}

function StorageCard({ s }: { s: (typeof STORAGE_FACILITIES)[0] }) {
  const handleBook = () => {
    if (!s.available) {
      toast.info("This facility is currently at capacity.");
      return;
    }
    toast.success(`Booking inquiry sent to "${s.name}"`, {
      duration: 3000,
      icon: "🏭",
    });
  };
  return (
    <div
      className="bg-card rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm"
      data-ocid="storage-card"
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{s.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {s.type} · {s.capacity}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
          <span className="font-medium text-primary">₹{s.ratePerMT}/MT</span>
          <span className="text-muted-foreground flex items-center gap-0.5">
            <MapPin className="h-2.5 w-2.5" />
            {s.location}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant={s.available ? "default" : "outline"}
        disabled={!s.available}
        className="h-7 text-[10px] shrink-0"
        onClick={handleBook}
        data-ocid="storage-book-btn"
      >
        {s.available ? "Book" : "Full"}
      </Button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

function SectionTitle({
  icon,
  title,
}: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="font-semibold text-sm flex items-center gap-1.5 px-4">
      {icon}
      {title}
    </h3>
  );
}

export function ServicesCategory() {
  const { data: services, isLoading } = useGetServices();
  const machinery = services?.machinery ?? [];
  const logistics = services?.logistics ?? [];

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Equipment Rental */}
      <div>
        <SectionTitle
          icon={<Wrench className="h-4 w-4 text-primary" />}
          title="Equipment Rental"
        />
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 mt-3">
            {Array.from({ length: 3 }, (_, i) => `msk-${i}`).map((k) => (
              <Skeleton
                key={k}
                className="w-40 h-52 rounded-2xl flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 mt-3">
            {(machinery as MachineryListing[]).map((m) => (
              <MachineryCard key={m.id.toString()} m={m} />
            ))}
          </div>
        )}
      </div>

      {/* Labor Services */}
      <div>
        <SectionTitle
          icon={<Users className="h-4 w-4 text-primary" />}
          title="Labor Services"
        />
        <div className="flex flex-col gap-2.5 px-4 mt-3">
          {LABOR_SERVICES.map((l) => (
            <LaborCard key={l.id} l={l} />
          ))}
        </div>
      </div>

      {/* Transportation */}
      <div>
        <SectionTitle
          icon={<Truck className="h-4 w-4 text-primary" />}
          title="Transportation"
        />
        {isLoading ? (
          <div className="flex flex-col gap-2.5 px-4 mt-3">
            {Array.from({ length: 3 }, (_, i) => `lsk-${i}`).map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 px-4 mt-3">
            {(logistics as LogisticsListing[]).map((l) => (
              <LogisticsCard key={l.id.toString()} l={l} />
            ))}
          </div>
        )}
      </div>

      {/* Processing & Storage */}
      <div>
        <SectionTitle
          icon={<Package className="h-4 w-4 text-primary" />}
          title="Processing & Storage"
        />
        <div className="flex flex-col gap-2.5 px-4 mt-3">
          {STORAGE_FACILITIES.map((s) => (
            <StorageCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
