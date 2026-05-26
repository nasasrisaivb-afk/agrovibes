import { createRoute } from "@tanstack/react-router";
import { AlertTriangle, GraduationCap, Tractor, Truck } from "lucide-react";
import { useRef } from "react";
import { AlertsSection } from "../components/services/AlertsSection";
import { ExpertSection } from "../components/services/ExpertSection";
import { LogisticsSection } from "../components/services/LogisticsSection";
import { MachinerySection } from "../components/services/MachinerySection";
import { useGetAlerts, useGetServices } from "../lib/backend";
import { AlertSeverity, AlertType } from "../types";
import type {
  Alert,
  ExpertProfile,
  LogisticsListing,
  MachineryListing,
} from "../types";
import { Route as rootRoute } from "./__root";

// ---- Fallback sample data ----
const FALLBACK_MACHINERY: MachineryListing[] = [
  {
    id: BigInt(1),
    dailyRate: 3500,
    ownerId: BigInt(1),
    name: "Mahindra 275 DI Tractor",
    available: true,
    imageUrl: "/assets/images/machinery-tractor.jpg",
    category: "Tractor",
  },
  {
    id: BigInt(2),
    dailyRate: 2200,
    ownerId: BigInt(2),
    name: "Rotavator Attachment",
    available: true,
    imageUrl: "/assets/images/machinery-rotavator.jpg",
    category: "Attachment",
  },
  {
    id: BigInt(3),
    dailyRate: 5000,
    ownerId: BigInt(3),
    name: "Combine Harvester",
    available: false,
    imageUrl: "/assets/images/machinery-harvester.jpg",
    category: "Harvester",
  },
  {
    id: BigInt(4),
    dailyRate: 1800,
    ownerId: BigInt(4),
    name: "Power Tiller",
    available: true,
    imageUrl: "/assets/images/machinery-tiller.jpg",
    category: "Tiller",
  },
];

const FALLBACK_LOGISTICS: LogisticsListing[] = [
  {
    id: BigInt(1),
    serviceArea: "Punjab & Haryana",
    ratePerKm: 12,
    imageUrl: "/assets/images/logistics-truck.jpg",
    providerName: "Kisan Transport Co.",
  },
  {
    id: BigInt(2),
    serviceArea: "Maharashtra",
    ratePerKm: 15,
    imageUrl: "/assets/images/logistics-van.jpg",
    providerName: "Farm Fresh Logistics",
  },
  {
    id: BigInt(3),
    serviceArea: "UP & Bihar",
    ratePerKm: 10,
    imageUrl: "/assets/images/logistics-tempu.jpg",
    providerName: "Annadata Carriers",
  },
];

const FALLBACK_EXPERTS: ExpertProfile[] = [
  {
    id: BigInt(1),
    name: "Dr. Anand Sharma",
    hourlyRate: 500,
    available: true,
    specialty: "Soil & Nutrition",
    imageUrl: "/assets/images/expert-1.jpg",
  },
  {
    id: BigInt(2),
    name: "Dr. Kavitha Rao",
    hourlyRate: 600,
    available: true,
    specialty: "Pest Management",
    imageUrl: "/assets/images/expert-2.jpg",
  },
  {
    id: BigInt(3),
    name: "Mr. Suresh Patel",
    hourlyRate: 400,
    available: false,
    specialty: "Irrigation Systems",
    imageUrl: "/assets/images/expert-3.jpg",
  },
];

const FALLBACK_ALERTS: Alert[] = [
  {
    id: BigInt(1),
    alertType: AlertType.Weather,
    title: "Heavy Rainfall Warning",
    description:
      "IMD predicts 80mm+ rainfall in next 48 hours. Protect standing crops.",
    timestamp: BigInt(Date.now()),
    severity: AlertSeverity.High,
    location: "Punjab, India",
  },
  {
    id: BigInt(2),
    alertType: AlertType.Pest,
    title: "Fall Armyworm Detected",
    description:
      "Fall armyworm outbreak reported in Ludhiana district. Check maize fields.",
    timestamp: BigInt(Date.now() - 3600000),
    severity: AlertSeverity.Critical,
    location: "Ludhiana",
  },
  {
    id: BigInt(3),
    alertType: AlertType.Weather,
    title: "Frost Advisory",
    description:
      "Low temperatures expected tonight. Cover frost-sensitive crops.",
    timestamp: BigInt(Date.now() - 7200000),
    severity: AlertSeverity.Medium,
    location: "Himachal Pradesh",
  },
  {
    id: BigInt(4),
    alertType: AlertType.Pest,
    title: "Locust Movement Spotted",
    description:
      "Locust swarms reported moving towards Rajasthan border. Prepare crop protection.",
    timestamp: BigInt(Date.now() - 10800000),
    severity: AlertSeverity.Low,
    location: "Rajasthan",
  },
];

// ---- Nav quick-link cards ----
const NAV_SECTIONS = [
  {
    id: "machinery",
    label: "Machinery Rentals",
    Icon: Tractor,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "logistics",
    label: "Logistics",
    Icon: Truck,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    id: "experts",
    label: "Expert Consult",
    Icon: GraduationCap,
    color: "text-trust",
    bg: "bg-trust/10",
  },
  {
    id: "alerts",
    label: "Alerts",
    Icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
] as const;

function ServicesContent() {
  const {
    data: services,
    isLoading,
    refetch: refetchServices,
  } = useGetServices();
  const {
    data: alertsData,
    isFetching: alertsRefreshing,
    refetch: refetchAlerts,
  } = useGetAlerts();

  const machineryRef = useRef<HTMLElement>(null);
  const logisticsRef = useRef<HTMLElement>(null);
  const expertsRef = useRef<HTMLElement>(null);
  const alertsRef = useRef<HTMLElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLElement | null>> = {
    machinery: machineryRef,
    logistics: logisticsRef,
    experts: expertsRef,
    alerts: alertsRef,
  };

  function scrollTo(id: string) {
    sectionRefs[id]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const machinery = services?.machinery?.length
    ? services.machinery
    : FALLBACK_MACHINERY;
  const logistics = services?.logistics?.length
    ? services.logistics
    : FALLBACK_LOGISTICS;
  const experts = services?.experts?.length
    ? services.experts
    : FALLBACK_EXPERTS;
  const alerts = alertsData?.length ? alertsData : FALLBACK_ALERTS;

  return (
    <div className="flex flex-col gap-5 p-4 pb-8">
      <h1 className="font-display font-bold text-xl">Services</h1>

      {/* Quick Nav Grid */}
      <div className="grid grid-cols-2 gap-3" data-ocid="services-nav-grid">
        {NAV_SECTIONS.map(({ id, label, Icon, color, bg }) => (
          <button
            key={id}
            type="button"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors active:scale-[0.97]"
            onClick={() => scrollTo(id)}
            data-ocid={`nav-${id}`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Machinery Rentals */}
      <section ref={machineryRef} className="scroll-mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tractor className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-display font-semibold text-base">
            Machinery Rentals
          </h2>
        </div>
        <MachinerySection machinery={machinery} isLoading={isLoading} />
      </section>

      {/* Logistics */}
      <section ref={logisticsRef} className="scroll-mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Truck className="h-4 w-4 text-accent" />
          </div>
          <h2 className="font-display font-semibold text-base">
            Logistics Partners
          </h2>
        </div>
        <LogisticsSection logistics={logistics} />
      </section>

      {/* Expert Consultation */}
      <section ref={expertsRef} className="scroll-mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-trust/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-trust" />
          </div>
          <h2 className="font-display font-semibold text-base">
            Expert Consultations
          </h2>
        </div>
        <ExpertSection experts={experts} />
      </section>

      {/* Alerts */}
      <section ref={alertsRef} className="scroll-mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <h2 className="font-display font-semibold text-base">
            Weather &amp; Pest Alerts
          </h2>
        </div>
        <AlertsSection
          alerts={alerts}
          onRefresh={() => {
            void refetchAlerts();
            void refetchServices();
          }}
          isRefreshing={alertsRefreshing}
        />
      </section>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesContent,
});
