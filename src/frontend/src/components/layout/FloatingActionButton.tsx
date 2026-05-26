import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Camera,
  GraduationCap,
  Plus,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { type UserRole, useRoleContext } from "../../context/RoleContext";

const FAB_CONFIG: Record<
  UserRole,
  { icon: React.ReactNode; label: string; to: string }
> = {
  farmer: {
    icon: <Camera className="h-5 w-5" />,
    label: "Document Activity",
    to: "/create",
  },
  educator: {
    icon: <GraduationCap className="h-5 w-5" />,
    label: "Start Lesson",
    to: "/create",
  },
  buyer: {
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Quick Purchase",
    to: "/marketplace",
  },
  machinery: {
    icon: <Wrench className="h-5 w-5" />,
    label: "List Equipment",
    to: "/create",
  },
  service: {
    icon: <Plus className="h-5 w-5" />,
    label: "Offer Help",
    to: "/create",
  },
};

const SHOW_ON_ROUTES = ["/", "/marketplace"];

export function FloatingActionButton() {
  const { role } = useRoleContext();
  const navigate = useNavigate();
  const state = useRouterState();
  const currentPath = state.location.pathname;

  const shouldShow = SHOW_ON_ROUTES.some((r) =>
    r === "/" ? currentPath === "/" : currentPath.startsWith(r),
  );

  if (!shouldShow) return null;

  const { icon, label, to } = FAB_CONFIG[role];

  return (
    <button
      type="button"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 h-12 px-5 rounded-full bg-accent text-accent-foreground shadow-elevated font-semibold text-sm transition-smooth hover:shadow-lg active:scale-95"
      onClick={() => navigate({ to })}
      data-ocid="fab-primary-button"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
