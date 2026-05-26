import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { ROLE_CONFIG, useRoleContext } from "../../context/RoleContext";
import type { UserRole } from "../../types";

interface RoleCardData {
  role: UserRole;
  emoji: string;
  description: string;
  benefits: string[];
  permissions: string[];
}

const ROLE_CARDS: RoleCardData[] = [
  {
    role: "farmer",
    emoji: "🌾",
    description:
      "Sell your produce directly to buyers, manage listings and track harvests",
    benefits: [
      "Zero commission on first 10 sales",
      "Free KYC verification",
      "Priority market alerts",
    ],
    permissions: [
      "Create listings",
      "Receive payments",
      "Access market rates",
      "Post reels",
    ],
  },
  {
    role: "buyer",
    emoji: "🛒",
    description:
      "Discover fresh produce from verified farmers with escrow protection",
    benefits: [
      "Escrow buyer protection",
      "Price comparison tools",
      "Bulk order discounts",
    ],
    permissions: [
      "Browse marketplace",
      "Place orders",
      "Request quotes",
      "Track shipments",
    ],
  },
  {
    role: "educator",
    emoji: "📚",
    description:
      "Share knowledge, create courses, and earn from teaching farmers",
    benefits: [
      "80% revenue share",
      "Course certification tools",
      "Student analytics",
    ],
    permissions: [
      "Publish courses",
      "Host webinars",
      "Issue certificates",
      "Mentor matching",
    ],
  },
  {
    role: "machinery",
    emoji: "🚜",
    description:
      "Rent out or sell agricultural equipment to farmers in your region",
    benefits: [
      "Equipment health tracker",
      "Rental calendar",
      "Location-based matching",
    ],
    permissions: [
      "List equipment",
      "Manage rentals",
      "Service records",
      "Delivery scheduling",
    ],
  },
  {
    role: "service",
    emoji: "🛠️",
    description:
      "Offer agricultural services — transport, labor, processing, storage",
    benefits: [
      "Service request alerts",
      "Instant booking",
      "Reputation building",
    ],
    permissions: [
      "List services",
      "Accept requests",
      "Manage schedule",
      "Invoice generation",
    ],
  },
];

const ACTIVE_EXTRA_ROLES: UserRole[] = ["buyer"];

export function RoleSettings() {
  const { role, setRole } = useRoleContext();

  const handleSwitch = (newRole: UserRole) => {
    if (newRole === role) return;
    setRole(newRole);
    toast.success(`Switched to ${ROLE_CONFIG[newRole].label} mode`, {
      description: "Your dashboard is being personalized.",
    });
  };

  const handleAddRole = () => {
    toast.info("Multi-role", { description: "Add another role coming soon!" });
  };

  return (
    <section>
      <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
        Role Settings
      </h2>

      <div className="flex flex-col gap-2.5">
        {ROLE_CARDS.map((card) => {
          const conf = ROLE_CONFIG[card.role];
          const isActive = card.role === role;
          const isSecondary =
            ACTIVE_EXTRA_ROLES.includes(card.role) && !isActive;

          return (
            <div
              key={card.role}
              className={`bg-card rounded-2xl border p-4 flex flex-col gap-3 transition-smooth ${
                isActive ? `${conf.borderClass} shadow-sm` : "border-border"
              }`}
              data-ocid={`roles.${card.role}-card`}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-xl ${conf.bgClass} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {card.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`font-semibold text-sm ${isActive ? conf.textClass : "text-foreground"}`}
                    >
                      {conf.label}
                    </p>
                    {isActive && (
                      <Badge
                        className={`${conf.bgClass} ${conf.textClass} border-0 text-[9px] gap-1 px-1.5`}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Active
                      </Badge>
                    )}
                    {isSecondary && (
                      <Badge
                        variant="outline"
                        className="text-[9px] border-border text-muted-foreground px-1.5"
                      >
                        Secondary
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Benefits
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.benefits.map((b) => (
                    <span
                      key={b}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isActive
                          ? `${conf.bgClass} ${conf.textClass} ${conf.borderClass}`
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Permissions
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {card.permissions.map((p) => (
                    <div key={p} className="flex items-center gap-1">
                      <CheckCircle2
                        className={`h-2.5 w-2.5 flex-shrink-0 ${isActive ? conf.textClass : "text-muted-foreground/50"}`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Switch button */}
              {!isActive && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={`h-8 text-xs w-full transition-smooth ${conf.borderClass} ${conf.textClass} hover:${conf.bgClass}`}
                  onClick={() => handleSwitch(card.role)}
                  data-ocid={`roles.switch-${card.role}-btn`}
                >
                  Switch to {conf.label}
                </Button>
              )}
            </div>
          );
        })}

        {/* Add another role */}
        <button
          type="button"
          onClick={handleAddRole}
          className="flex items-center gap-3 bg-card rounded-2xl border border-dashed border-primary/30 p-4 hover:bg-primary/5 transition-smooth text-left"
          data-ocid="roles.add-role-btn"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <PlusCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Add Another Role
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Farmers can also be buyers, educators, and more
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
